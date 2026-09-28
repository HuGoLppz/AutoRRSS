/**
 * Búsqueda, filtrado y ordenación de ideas. Funciones puras.
 *
 * Reglas de combinación de filtros:
 *  - Dentro de una misma faceta (estado, plataforma, categoría) basta con
 *    cumplir una de las opciones elegidas (TikTok o Instagram).
 *  - Las etiquetas exigen TODAS las elegidas (IA y tutorial).
 *  - Entre facetas distintas se exige cumplir todas (TikTok + IA + Programada).
 *
 * Cuando el backend soporte filtrado, este objeto de filtros se enviará como
 * query string a GET /ideas y esta lógica pasará al servidor.
 */
import { PRIORITY_META, STATUS_META } from "../models/idea";

export const EMPTY_FILTERS = Object.freeze({
  q: "",
  status: [],
  platform: [],
  category: [],
  tags: [],
  favorites: false,
  sort: "created-desc",
});

export const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function haystack(idea) {
  return normalizeText(
    [
      idea.title,
      idea.description,
      idea.category,
      idea.platform,
      STATUS_META[idea.status]?.label,
      idea.tags.join(" "),
      idea.notes,
    ].join(" "),
  );
}

/** Todas las palabras de la búsqueda deben aparecer en algún campo. */
export function matchesQuery(idea, q) {
  const tokens = normalizeText(q).replace(/#/g, "").split(/[\s+]+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const text = haystack(idea);
  return tokens.every((token) => text.includes(token));
}

export function filterIdeas(ideas, filters) {
  const f = { ...EMPTY_FILTERS, ...filters };
  return ideas.filter(
    (idea) =>
      matchesQuery(idea, f.q) &&
      (f.status.length === 0 || f.status.includes(idea.status)) &&
      (f.platform.length === 0 || f.platform.includes(idea.platform)) &&
      (f.category.length === 0 || f.category.includes(idea.category)) &&
      (f.tags.length === 0 || f.tags.every((tag) => idea.tags.includes(tag))) &&
      (!f.favorites || idea.favorite),
  );
}

const byCreatedDesc = (a, b) => b.createdAt.localeCompare(a.createdAt);

const COMPARATORS = {
  "created-desc": byCreatedDesc,
  "created-asc": (a, b) => a.createdAt.localeCompare(b.createdAt),
  "date-asc": (a, b) => {
    if (!a.publishDate && !b.publishDate) return byCreatedDesc(a, b);
    if (!a.publishDate) return 1;
    if (!b.publishDate) return -1;
    return a.publishDate.localeCompare(b.publishDate) || byCreatedDesc(a, b);
  },
  "date-desc": (a, b) => {
    if (!a.publishDate && !b.publishDate) return byCreatedDesc(a, b);
    if (!a.publishDate) return 1;
    if (!b.publishDate) return -1;
    return b.publishDate.localeCompare(a.publishDate) || byCreatedDesc(a, b);
  },
  "priority-desc": (a, b) =>
    PRIORITY_META[b.priority].rank - PRIORITY_META[a.priority].rank || byCreatedDesc(a, b),
  "priority-asc": (a, b) =>
    PRIORITY_META[a.priority].rank - PRIORITY_META[b.priority].rank || byCreatedDesc(a, b),
};

export const sortIdeas = (ideas, sort = "created-desc") =>
  [...ideas].sort(COMPARATORS[sort] ?? byCreatedDesc);

export const queryIdeas = (ideas, filters) =>
  sortIdeas(filterIdeas(ideas, filters), filters?.sort);

/** Número de filtros activos (sin contar orden ni búsqueda). */
export const countActiveFilters = (f) =>
  f.status.length + f.platform.length + f.category.length + f.tags.length + (f.favorites ? 1 : 0);

export const hasAnyFilter = (f) => countActiveFilters(f) > 0 || f.q.trim() !== "";

/** Valores únicos con su frecuencia, ordenados de más a menos usados. */
export function collectFacet(ideas, pick) {
  const counts = new Map();
  for (const idea of ideas) {
    for (const value of [].concat(pick(idea))) {
      if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
    .map(([value, count]) => ({ value, count }));
}
