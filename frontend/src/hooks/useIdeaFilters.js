import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SORT_OPTIONS, STATUS_ORDER } from "../models/idea";
import { EMPTY_FILTERS } from "../utils/ideaQuery";

/**
 * Filtros de la biblioteca, sincronizados con la URL
 * (/ideas?q=ia&platform=TikTok&status=scheduled) para poder compartir o
 * volver atrás. El estado vive en React (escribir es instantáneo) y se
 * refleja en la URL; si la URL cambia desde fuera (buscador global) se
 * vuelve a leer.
 */
function parse(params, forceFavorites) {
  const sort = params.get("sort");
  return {
    filters: {
      q: params.get("q") ?? "",
      status: params.getAll("status").filter((s) => STATUS_ORDER.includes(s)),
      platform: params.getAll("platform"),
      category: params.getAll("category"),
      tags: params.getAll("tag"),
      favorites: forceFavorites || params.get("fav") === "1",
      sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : EMPTY_FILTERS.sort,
    },
    view: params.get("view") === "list" ? "list" : "grid",
  };
}

function serialize({ filters, view }, forceFavorites) {
  const p = new URLSearchParams();
  if (filters.q.trim()) p.set("q", filters.q);
  filters.status.forEach((v) => p.append("status", v));
  filters.platform.forEach((v) => p.append("platform", v));
  filters.category.forEach((v) => p.append("category", v));
  filters.tags.forEach((v) => p.append("tag", v));
  if (filters.favorites && !forceFavorites) p.set("fav", "1");
  if (filters.sort !== EMPTY_FILTERS.sort) p.set("sort", filters.sort);
  if (view === "list") p.set("view", "list");
  return p.toString();
}

export function useIdeaFilters({ forceFavorites = false } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState(() => parse(searchParams, forceFavorites));
  const written = useRef(new Set([searchParams.toString()]));

  // URL → estado (cambios externos, p. ej. buscador global)
  useEffect(() => {
    if (written.current.has(searchParams.toString())) return;
    setState(parse(searchParams, forceFavorites));
  }, [searchParams, forceFavorites]);

  // estado → URL
  useEffect(() => {
    const next = serialize(state, forceFavorites);
    if (next === searchParams.toString()) return;
    written.current.add(next);
    setSearchParams(new URLSearchParams(next), { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, forceFavorites]);

  const setFilters = useCallback(
    (patch) => setState((s) => ({ ...s, filters: { ...s.filters, ...patch } })),
    [],
  );
  const setView = useCallback((view) => setState((s) => ({ ...s, view })), []);
  const resetFilters = useCallback(
    () =>
      setState((s) => ({
        ...s,
        filters: { ...EMPTY_FILTERS, sort: s.filters.sort, favorites: forceFavorites },
      })),
    [forceFavorites],
  );

  return { filters: state.filters, view: state.view, setFilters, setView, resetFilters };
}
