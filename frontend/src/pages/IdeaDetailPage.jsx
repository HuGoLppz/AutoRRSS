import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileQuestion } from "lucide-react";
import IdeaDetail from "../components/ideas/IdeaDetail";
import IdeaForm from "../components/ideas/IdeaForm";
import DataGate from "../components/ui/DataGate";
import EmptyState from "../components/ui/EmptyState";
import { useIdea } from "../hooks/useIdea";
import { useIdeas } from "../store/IdeasContext";

export default function IdeaDetailPage() {
  const { id } = useParams();
  const { idea, state } = useIdea(id);
  const { updateIdea, isPending, reload } = useIdeas();
  const [editing, setEditing] = useState(false);

  const save = async (values) => {
    // Favorita, origen y fechas de sistema se gestionan aparte.
    const { favorite: _f, source: _s, ...patch } = values;
    if (await updateIdea(id, patch)) setEditing(false);
  };

  return (
    <div className="page">
      <Link to="/ideas" className="back-link">
        <ArrowLeft size={16} aria-hidden /> Mis ideas
      </Link>

      <DataGate
        status={state === "ready" || state === "missing" ? "ready" : state}
        error="Inténtalo de nuevo."
        onRetry={reload}
        skeleton={<div className="skeleton skeleton--detail" />}
      >
        {state === "missing" ? (
          <EmptyState
            icon={FileQuestion}
            title="No hemos encontrado esta idea"
            description="Puede que se haya eliminado."
          >
            <Link to="/ideas" className="btn btn--secondary btn--md">
              <span>Volver a Mis ideas</span>
            </Link>
          </EmptyState>
        ) : editing ? (
          <section className="panel">
            <h1 className="panel__title">Editar idea</h1>
            <IdeaForm
              initialValues={idea}
              onSubmit={save}
              onCancel={() => setEditing(false)}
              submitLabel="Guardar cambios"
              saving={isPending(id) === "saving"}
            />
          </section>
        ) : (
          <IdeaDetail idea={idea} onEdit={() => setEditing(true)} />
        )}
      </DataGate>
    </div>
  );
}
