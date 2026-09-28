import { CheckCheck, RefreshCw, Sparkles, TriangleAlert } from "lucide-react";
import DraftCard from "../components/ideas/DraftCard";
import GeneratorForm from "../components/ideas/GeneratorForm";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { useGeneration } from "../store/GenerationContext";
import { useIdeas } from "../store/IdeasContext";

export default function GeneratePage() {
  const { drafts, status, error, notice, count, generate, saveAll } =
    useGeneration();
  const { isPending } = useIdeas();
  const unsaved = drafts.filter((d) => !d.savedId);
  const savingAll = Boolean(isPending("new"));

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Generar idea</h1>
          <p className="muted">
            Crea propuestas con IA, revísalas y guarda solo las que te sirvan.
          </p>
        </div>
      </header>

      <div className="generate-layout">
        <GeneratorForm />

        <section
          className="generate-results"
          aria-live="polite"
          aria-label="Ideas generadas"
        >
          {status === "idle" && (
            <EmptyState
              icon={Sparkles}
              title="Tus ideas aparecerán aquí"
              description="Completa los datos de tu empresa y genera. Podrás editar cada idea antes de guardarla en tu biblioteca."
            />
          )}

          {status === "loading" && (
            <div className="generating" aria-busy="true">
              <p className="muted">
                Generando {count === 1 ? "tu idea" : `${count} ideas`}…
              </p>
              {Array.from({ length: Math.min(count, 3) }, (_, i) => (
                <div key={i} className="skeleton skeleton--draft" />
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="alert alert--error" role="alert">
              <TriangleAlert size={18} aria-hidden />
              <div>
                <strong>No se ha podido generar</strong>
                <p>{error}</p>
              </div>
              <Button size="sm" icon={RefreshCw} onClick={generate}>
                Reintentar
              </Button>
            </div>
          )}

          {status === "done" && (
            <>
              <div className="results-head">
                <h2>
                  {drafts.length}{" "}
                  {drafts.length === 1 ? "idea generada" : "ideas generadas"}
                </h2>
                {unsaved.length > 1 && (
                  <Button
                    icon={CheckCheck}
                    onClick={saveAll}
                    loading={savingAll}
                  >
                    Guardar todas ({unsaved.length})
                  </Button>
                )}
              </div>
              {notice && (
                <div className="alert alert--warning" role="status">
                  <TriangleAlert size={18} aria-hidden />
                  <p>{notice}</p>
                </div>
              )}
              {drafts.length === 0 && (
                <EmptyState
                  title="Has revisado todas las ideas"
                  description="Puedes generar otras nuevas cuando quieras."
                />
              )}
              {drafts.map((draft, i) => (
                <DraftCard
                  key={draft.localId}
                  draft={draft}
                  defaultOpen={drafts.length === 1 || i === 0}
                />
              ))}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
