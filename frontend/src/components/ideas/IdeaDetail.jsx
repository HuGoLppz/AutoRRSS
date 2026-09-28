import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarClock, Copy, Pencil, Trash2 } from "lucide-react";
import { useIdeas } from "../../store/IdeasContext";
import { useUI } from "../../store/UIContext";
import { formatFull, formatLong, formatTimestamp } from "../../utils/dates";
import Button from "../ui/Button";
import { PlatformBadge } from "./Badges";
import FavoriteButton from "./FavoriteButton";
import PrioritySelector from "./PrioritySelector";
import StatusSelector from "./StatusSelector";
import TagSelector from "./TagSelector";

function CopyBlock({ label, text, children }) {
  const { toast } = useUI();
  if (!text?.trim() && !children) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`${label} copiado`);
    } catch {
      toast("No se ha podido copiar. Selecciona el texto manualmente.", "error");
    }
  };
  return (
    <div className="generated">
      <div className="generated__head">
        <h3>{label}</h3>
        <Button size="sm" variant="ghost" icon={Copy} onClick={copy}>Copiar</Button>
      </div>
      {children ?? <p>{text}</p>}
    </div>
  );
}

/**
 * Vista completa de una idea. Estado, prioridad, fecha, favorita, etiquetas y
 * notas se guardan al momento; "Editar" abre el formulario con todos los campos.
 */
export default function IdeaDetail({ idea, onEdit }) {
  const navigate = useNavigate();
  const { updateIdea, setStatus, deleteIdea, isPending } = useIdeas();
  const { confirm, openSchedule } = useUI();
  const busy = Boolean(isPending(idea.id));
  const [notes, setNotes] = useState(idea.notes);

  useEffect(() => setNotes(idea.notes), [idea.notes]);

  const changeStatus = (status) => {
    if (status === idea.status) return;
    if (status === "scheduled" && !idea.publishDate) {
      openSchedule(idea); // Programada necesita una fecha
      return;
    }
    setStatus(idea.id, status);
  };

  const remove = async () => {
    const ok = await confirm({
      title: "Eliminar idea",
      message: `«${idea.title}» se eliminará definitivamente. No se puede deshacer.`,
      confirmLabel: "Eliminar",
      tone: "danger",
    });
    if (ok && (await deleteIdea(idea.id))) navigate("/ideas", { replace: true });
  };

  const g = idea.generated;

  return (
    <article className={`detail ${busy ? "is-busy" : ""}`}>
      <header className="detail__header">
        <div className="row-gap">
          <PlatformBadge platform={idea.platform} />
          <span className="muted">{[idea.contentType, idea.category].filter(Boolean).join(" · ")}</span>
        </div>
        <h1>{idea.title}</h1>
        <div className="detail__actions">
          <FavoriteButton idea={idea} withLabel />
          <Button icon={Pencil} onClick={onEdit}>Editar</Button>
          <Button icon={CalendarClock} onClick={() => openSchedule(idea)}>
            {idea.publishDate ? "Cambiar fecha" : "Programar"}
          </Button>
          <Button variant="danger" icon={Trash2} onClick={remove} loading={isPending(idea.id) === "deleting"}>Eliminar</Button>
        </div>
      </header>

      <section aria-label="Estado en el flujo de trabajo" className="detail__workflow">
        <StatusSelector value={idea.status} onChange={changeStatus} disabled={busy} />
      </section>

      <div className="detail__columns">
        <div className="detail__main">
          <section className="panel">
            <h2>Descripción</h2>
            <p className="prewrap">{idea.description}</p>
          </section>

          {g && (
            <section className="panel">
              <h2>Contenido generado</h2>
              <CopyBlock label="Hook" text={g.hook} />
              <CopyBlock label="Guion" text={g.script} />
              <CopyBlock label="Caption" text={g.caption} />
              {g.hashtags.length > 0 && (
                <CopyBlock label="Hashtags" text={g.hashtags.join(" ")}>
                  <p className="hashtags">{g.hashtags.join(" ")}</p>
                </CopyBlock>
              )}
            </section>
          )}

          <section className="panel">
            <h2>Notas</h2>
            <textarea
              aria-label="Notas"
              rows={4}
              value={notes}
              placeholder="Añade notas: referencias, pendientes, ideas de grabación…"
              onChange={(e) => setNotes(e.target.value)}
            />
            {notes !== idea.notes && (
              <div className="form-actions">
                <Button variant="ghost" onClick={() => setNotes(idea.notes)}>Descartar</Button>
                <Button variant="primary" loading={busy} onClick={() => updateIdea(idea.id, { notes })}>Guardar notas</Button>
              </div>
            )}
          </section>
        </div>

        <aside className="detail__side">
          <section className="panel">
            <h2>Detalles</h2>
            <dl className="facts">
              <div>
                <dt>Prioridad</dt>
                <dd><PrioritySelector value={idea.priority} disabled={busy} onChange={(priority) => updateIdea(idea.id, { priority }, { silent: true })} /></dd>
              </div>
              <div>
                <dt>{idea.status === "published" ? "Fecha de publicación" : "Publicación prevista"}</dt>
                <dd>{idea.publishDate ? formatLong(idea.publishDate) : <span className="muted">Sin fecha</span>}</dd>
              </div>
              <div><dt>Creada</dt><dd>{formatTimestamp(idea.createdAt)}</dd></div>
              <div><dt>Última edición</dt><dd>{formatTimestamp(idea.updatedAt)}</dd></div>
              {idea.publishedAt && <div><dt>Publicada el</dt><dd>{formatFull(idea.publishedAt.slice(0, 10))}</dd></div>}
            </dl>
          </section>

          <section className="panel">
            <h2>Etiquetas</h2>
            <TagSelector value={idea.tags} onChange={(tags) => updateIdea(idea.id, { tags }, { silent: true })} />
          </section>

          {idea.source && (
            <section className="panel">
              <h2>Generada para</h2>
              <dl className="facts">
                <div><dt>Empresa</dt><dd>{idea.source.company}</dd></div>
                <div><dt>Sector</dt><dd>{idea.source.sector}</dd></div>
                <div><dt>Público</dt><dd>{idea.source.audience}</dd></div>
              </dl>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}
