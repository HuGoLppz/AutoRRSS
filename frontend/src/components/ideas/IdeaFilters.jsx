import { useMemo, useState } from "react";
import { LayoutGrid, List, SlidersHorizontal, Star, X } from "lucide-react";
import { PLATFORMS, SORT_OPTIONS, STATUS_META, STATUS_ORDER } from "../../models/idea";
import { collectFacet, countActiveFilters } from "../../utils/ideaQuery";
import Button from "../ui/Button";
import SegmentedControl from "../ui/SegmentedControl";
import SearchBar from "./SearchBar";

function FilterGroup({ label, options, selected, onToggle }) {
  if (options.length === 0) return null;
  return (
    <fieldset className="filter-group">
      <legend>{label}</legend>
      <div className="filter-group__chips">
        {options.map((option) => {
          const on = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              className={`chip chip--toggle ${on ? "is-on" : ""}`}
              aria-pressed={on}
              onClick={() => onToggle(option.value)}
            >
              {option.label}
              {option.count !== undefined && <span className="chip__count">{option.count}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const toggle = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

/**
 * Buscador + filtros combinables + orden + vista.
 * `allIdeas` alimenta las opciones (categorías, etiquetas) y sus contadores.
 */
export default function IdeaFilters({
  filters, onChange, onReset, allIdeas, view, onViewChange, hideFavorites = false,
}) {
  const [open, setOpen] = useState(false);
  const active = countActiveFilters({ ...filters, favorites: hideFavorites ? false : filters.favorites });

  const facets = useMemo(() => ({
    status: STATUS_ORDER.map((s) => ({
      value: s, label: STATUS_META[s].label, count: allIdeas.filter((i) => i.status === s).length,
    })),
    platform: PLATFORMS.map((p) => ({
      value: p, label: p, count: allIdeas.filter((i) => i.platform === p).length,
    })),
    category: collectFacet(allIdeas, (i) => i.category).map((c) => ({ value: c.value, label: c.value, count: c.count })),
    tags: collectFacet(allIdeas, (i) => i.tags).slice(0, 16).map((t) => ({ value: t.value, label: t.value, count: t.count })),
  }), [allIdeas]);

  const activeChips = [
    ...filters.status.map((v) => ({ key: `s-${v}`, label: STATUS_META[v].label, clear: () => onChange({ status: toggle(filters.status, v) }) })),
    ...filters.platform.map((v) => ({ key: `p-${v}`, label: v, clear: () => onChange({ platform: toggle(filters.platform, v) }) })),
    ...filters.category.map((v) => ({ key: `c-${v}`, label: v, clear: () => onChange({ category: toggle(filters.category, v) }) })),
    ...filters.tags.map((v) => ({ key: `t-${v}`, label: `#${v}`, clear: () => onChange({ tags: toggle(filters.tags, v) }) })),
    ...(filters.favorites && !hideFavorites ? [{ key: "fav", label: "Favoritas", clear: () => onChange({ favorites: false }) }] : []),
  ];

  return (
    <section className="filters" aria-label="Buscar y filtrar">
      <div className="filters__bar">
        <SearchBar
          className="filters__search"
          value={filters.q}
          onChange={(q) => onChange({ q })}
          placeholder="Buscar por título, etiqueta, nota…"
        />
        <div className="filters__controls">
          <Button
            icon={SlidersHorizontal}
            variant={open || active ? "primary" : "secondary"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            Filtros{active > 0 ? ` (${active})` : ""}
          </Button>
          <select aria-label="Ordenar por" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <SegmentedControl
            label="Vista"
            value={view}
            onChange={onViewChange}
            options={[
              { value: "grid", label: "Tarjetas", icon: LayoutGrid },
              { value: "list", label: "Lista", icon: List },
            ]}
          />
        </div>
      </div>

      {open && (
        <div className="filters__panel">
          {!hideFavorites && (
            <button
              type="button"
              className={`chip chip--toggle chip--fav ${filters.favorites ? "is-on" : ""}`}
              aria-pressed={filters.favorites}
              onClick={() => onChange({ favorites: !filters.favorites })}
            >
              <Star size={13} aria-hidden fill={filters.favorites ? "currentColor" : "none"} /> Solo favoritas
            </button>
          )}
          <FilterGroup label="Estado" options={facets.status} selected={filters.status} onToggle={(v) => onChange({ status: toggle(filters.status, v) })} />
          <FilterGroup label="Red social" options={facets.platform} selected={filters.platform} onToggle={(v) => onChange({ platform: toggle(filters.platform, v) })} />
          <FilterGroup label="Categoría" options={facets.category} selected={filters.category} onToggle={(v) => onChange({ category: toggle(filters.category, v) })} />
          <FilterGroup label="Etiquetas (deben cumplirse todas)" options={facets.tags} selected={filters.tags} onToggle={(v) => onChange({ tags: toggle(filters.tags, v) })} />
        </div>
      )}

      {activeChips.length > 0 && (
        <div className="filters__active" aria-label="Filtros activos">
          {activeChips.map((chip) => (
            <span key={chip.key} className="chip chip--removable chip--accent">
              {chip.label}
              <button type="button" aria-label={`Quitar filtro ${chip.label}`} onClick={chip.clear}><X size={12} aria-hidden /></button>
            </span>
          ))}
          <Button size="sm" variant="ghost" onClick={onReset}>Limpiar filtros</Button>
        </div>
      )}
    </section>
  );
}
