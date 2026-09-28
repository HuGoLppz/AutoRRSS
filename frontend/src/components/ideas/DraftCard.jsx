import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { useGeneration } from "../../store/GenerationContext";
import Button from "../ui/Button";
import { PlatformBadge } from "./Badges";
import IdeaForm from "./IdeaForm";

/**
 * Borrador generado por Gemini. Se puede revisar y modificar con el mismo
 * formulario que una idea guardada; no existe en la biblioteca hasta pulsar
 * "Guardar en mis ideas".
 */
export default function DraftCard({ draft, defaultOpen }) {
  const { updateDraft, saveDraft, discardDraft } = useGeneration();
  const [open, setOpen] = useState(defaultOpen);
  const saved = Boolean(draft.savedId);

  return (
    <article className={`draft ${saved ? "is-saved" : ""}`}>
      <button type="button" className="draft__head" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="draft__titles">
          <span className="draft__title">{draft.values.title || "Idea sin título"}</span>
          <span className="row-gap">
            <PlatformBadge platform={draft.values.platform} />
            {saved && <span className="draft__saved"><CheckCircle2 size={14} aria-hidden /> Guardada</span>}
          </span>
        </span>
        <ChevronDown size={18} className="draft__chevron" aria-hidden />
      </button>

      {saved && (
        <div className="draft__saved-bar">
          <span>Ya está en tu biblioteca.</span>
          <Link to={`/ideas/${draft.savedId}`} className="btn btn--secondary btn--sm"><span>Abrir idea</span></Link>
        </div>
      )}

      <div className="draft__body" hidden={!open || saved}>
        <IdeaForm
          initialValues={draft.values}
          onChange={(values) => updateDraft(draft.localId, values)}
          onSubmit={(values) => saveDraft(draft.localId, values)}
          submitLabel="Guardar en mis ideas"
          saving={draft.saving}
          footerExtra={<Button variant="ghost" className="push-left" onClick={() => discardDraft(draft.localId)} disabled={draft.saving}>Descartar</Button>}
        />
      </div>
    </article>
  );
}
