import { Link } from "react-router-dom";
import { formatRelative } from "../../utils/dates";
import { PlatformBadge, StatusBadge } from "../ideas/Badges";

/** Lista compacta de ideas. `mode`: "date" muestra la fecha de publicación, "status" el estado. */
export default function IdeaMiniList({ ideas, mode = "date", empty }) {
  if (ideas.length === 0) return <p className="muted mini-empty">{empty}</p>;
  return (
    <ul className="mini-list">
      {ideas.map((idea) => (
        <li key={idea.id}>
          <Link to={`/ideas/${idea.id}`} className="mini-item">
            <span className="mini-item__title">{idea.title}</span>
            <span className="mini-item__meta">
              <PlatformBadge platform={idea.platform} />
              {mode === "date" ? (
                <span className="mini-item__date">{idea.publishDate ? formatRelative(idea.publishDate) : "Sin fecha"}</span>
              ) : (
                <StatusBadge status={idea.status} />
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
