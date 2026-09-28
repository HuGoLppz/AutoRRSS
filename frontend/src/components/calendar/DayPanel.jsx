import { Link } from "react-router-dom";
import { CalendarClock, CalendarX, Plus } from "lucide-react";
import { useIdeas } from "../../store/IdeasContext";
import { useUI } from "../../store/UIContext";
import { formatLong, todayISO } from "../../utils/dates";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import { PlatformBadge, StatusBadge } from "../ideas/Badges";

/** Detalle del día seleccionado: sus publicaciones y acciones de programación. */
export default function DayPanel({ day, ideas, onAdd }) {
  const { unscheduleIdea, isPending } = useIdeas();
  const { openSchedule } = useUI();

  return (
    <aside className="day-panel" aria-label={`Publicaciones del ${formatLong(day)}`}>
      <header>
        <h2>{formatLong(day)}</h2>
        {day === todayISO() && <span className="badge badge--today">Hoy</span>}
      </header>

      {ideas.length === 0 ? (
        <p className="muted">No hay nada programado este día.</p>
      ) : (
        <ul className="day-panel__list">
          {ideas.map((idea) => (
            <li key={idea.id} className={`day-panel__item ${isPending(idea.id) ? "is-busy" : ""}`}>
              <Link to={`/ideas/${idea.id}`} className="day-panel__title">{idea.title}</Link>
              <div className="row-gap"><PlatformBadge platform={idea.platform} /><StatusBadge status={idea.status} /></div>
              <div className="day-panel__actions">
                <IconButton icon={CalendarClock} label="Cambiar fecha" size={16} onClick={() => openSchedule(idea)} />
                {idea.status !== "published" && (
                  <IconButton icon={CalendarX} label="Cancelar programación" size={16} onClick={() => unscheduleIdea(idea.id)} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Button icon={Plus} onClick={onAdd}>Programar una idea</Button>
    </aside>
  );
}
