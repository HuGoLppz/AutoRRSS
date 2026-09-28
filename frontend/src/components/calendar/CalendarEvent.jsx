import { Link } from "react-router-dom";

const PLATFORM_CLASS = { TikTok: "tiktok", Instagram: "instagram", YouTube: "youtube", LinkedIn: "linkedin" };

/** Evento del calendario: abre el detalle y se puede arrastrar a otro día. */
export default function CalendarEvent({ idea, draggable = true }) {
  return (
    <Link
      to={`/ideas/${idea.id}`}
      className={`cal-event cal-event--${idea.status}`}
      draggable={draggable}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", idea.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      onClick={(event) => event.stopPropagation()}
      title={`${idea.title} · ${idea.platform}`}
    >
      <span className={`platform__dot platform__dot--${PLATFORM_CLASS[idea.platform] ?? "other"}`} aria-hidden />
      <span className="cal-event__title">{idea.title}</span>
    </Link>
  );
}
