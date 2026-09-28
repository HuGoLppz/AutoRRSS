import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, SearchX, Sparkles, Star } from "lucide-react";
import { useIdeaFilters } from "../../hooks/useIdeaFilters";
import { useIdeas } from "../../store/IdeasContext";
import { hasAnyFilter, queryIdeas } from "../../utils/ideaQuery";
import Button from "../ui/Button";
import DataGate, { CardSkeletons } from "../ui/DataGate";
import EmptyState from "../ui/EmptyState";
import IdeaFilters from "./IdeaFilters";
import IdeaList from "./IdeaList";

/**
 * Biblioteca de ideas: buscador + filtros + lista, con todos sus estados
 * (cargando, error, vacía, sin resultados). La usan "Mis ideas" y "Favoritos".
 */
export default function IdeasBrowser({ title, favoritesOnly = false }) {
  const { ideas, status, error, reload } = useIdeas();
  const { filters, view, setFilters, setView, resetFilters } = useIdeaFilters({ forceFavorites: favoritesOnly });

  const pool = useMemo(() => (favoritesOnly ? ideas.filter((i) => i.favorite) : ideas), [ideas, favoritesOnly]);
  const results = useMemo(() => queryIdeas(ideas, filters), [ideas, filters]);

  const filtered = hasAnyFilter({ ...filters, favorites: favoritesOnly ? false : filters.favorites });

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>{title}</h1>
          {status === "ready" && (
            <p className="muted">
              {results.length} {results.length === 1 ? "idea" : "ideas"}
              {filtered && pool.length !== results.length ? ` de ${pool.length}` : ""}
            </p>
          )}
        </div>
        <div className="page__actions">
          <Link to="/ideas/nueva" className="btn btn--secondary btn--md"><Plus size={16} aria-hidden /><span>Nueva idea</span></Link>
          <Link to="/generar" className="btn btn--primary btn--md"><Sparkles size={16} aria-hidden /><span>Generar idea</span></Link>
        </div>
      </header>

      <IdeaFilters
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        allIdeas={pool}
        view={view}
        onViewChange={setView}
        hideFavorites={favoritesOnly}
      />

      <DataGate status={status} error={error} onRetry={reload} skeleton={<CardSkeletons layout={view} />}>
        {pool.length === 0 ? (
          favoritesOnly ? (
            <EmptyState icon={Star} title="Aún no tienes favoritas" description="Marca una idea con la estrella y la encontrarás aquí.">
              <Link to="/ideas" className="btn btn--secondary btn--md"><span>Ver mis ideas</span></Link>
            </EmptyState>
          ) : (
            <EmptyState icon={Sparkles} title="Tu biblioteca está vacía" description="Genera ideas con IA o crea una a mano. Se guardarán aquí.">
              <Link to="/generar" className="btn btn--primary btn--md"><Sparkles size={16} aria-hidden /><span>Generar idea</span></Link>
              <Link to="/ideas/nueva" className="btn btn--secondary btn--md"><span>Crear a mano</span></Link>
            </EmptyState>
          )
        ) : results.length === 0 ? (
          <EmptyState icon={SearchX} title="Ninguna idea coincide" description="Prueba con otras palabras o quita algún filtro.">
            <Button onClick={resetFilters}>Limpiar búsqueda y filtros</Button>
          </EmptyState>
        ) : (
          <IdeaList ideas={results} view={view} />
        )}
      </DataGate>
    </div>
  );
}
