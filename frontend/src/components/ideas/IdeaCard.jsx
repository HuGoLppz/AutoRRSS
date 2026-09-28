import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { useIdeas } from "../../store/IdeasContext";
import { formatRelative } from "../../utils/dates";
import { PlatformBadge, PriorityBadge, StatusBadge } from "./Badges";
import FavoriteButton from "./FavoriteButton";

/** Tarjeta de idea. `layout`: "grid" (tarjeta) | "list" (fila compacta). */
export default function IdeaCard({ idea, layout = "grid" }) {
  const { isPending } = useIdeas();
  const busy = isPending(idea.id);
  const shownTags = idea.tags.slice(0, 3);
  const extraTags = idea.tags.length - shownTags.length;

  return (
    <article className={`idea-card idea-card--${layout} ${busy ? "is-busy" : ""}`} aria-busy={busy ? true : undefined}>
      <div className="idea-card__meta">
        <PlatformBadge platform={idea.platform} />
        {idea.category && <span className="idea-card__category">{idea.category}</span>}
      </div>

      <div className="idea-card__main">
        <h3 className="idea-card__title">
          <Link to={`/ideas/${idea.id}`}>{idea.title}</Link>
        </h3>
        {layout === "grid" && <p className="idea-card__desc">{idea.description}</p>}
        {shownTags.length > 0 && (
          <ul className="idea-card__tags" aria-label="Etiquetas">
            {shownTags.map((tag) => <li key={tag} className="chip">{tag}</li>)}
            {extraTags > 0 && <li className="chip chip--more">+{extraTags}</li>}
          </ul>
        )}
      </div>

      <div className="idea-card__status"><StatusBadge status={idea.status} /></div>

      <div className="idea-card__date">
        <CalendarDays size={14} aria-hidden />
        {idea.publishDate ? formatRelative(idea.publishDate) : <span className="muted">Sin fecha</span>}
      </div>

      <div className="idea-card__priority"><PriorityBadge priority={idea.priority} /></div>

      <div className="idea-card__fav"><FavoriteButton idea={idea} size={17} /></div>
    </article>
  );
}
