import { Link } from "react-router-dom";
import { CalendarX2 } from "lucide-react";
import { endOfMonth, formatLong, formatMonthYear, startOfMonth, todayISO } from "../../utils/dates";
import EmptyState from "../ui/EmptyState";
import { PlatformBadge, PriorityBadge, StatusBadge } from "../ideas/Badges";

/** Lista cronológica de las publicaciones del mes en curso del calendario. */
export default function AgendaView({ cursor, byDay }) {
  const from = startOfMonth(cursor);
  const to = endOfMonth(cursor);
  const days = [...byDay.keys()].filter((d) => d >= from && d <= to).sort();
  const today = todayISO();

  if (days.length === 0) {
    return (
      <EmptyState icon={CalendarX2} title={`Nada programado en ${formatMonthYear(cursor)}`} description="Cambia de mes o programa una idea desde su detalle." />
    );
  }

  return (
    <div className="agenda">
      {days.map((day) => (
        <section key={day} className="agenda__day">
          <h3 className={day === today ? "is-today" : ""}>
            {formatLong(day)}
            {day === today && <span className="badge badge--today">Hoy</span>}
          </h3>
          <ul>
            {byDay.get(day).map((idea) => (
              <li key={idea.id}>
                <Link to={`/ideas/${idea.id}`} className="agenda__item">
                  <span className="agenda__title">{idea.title}</span>
                  <span className="row-gap">
                    <PlatformBadge platform={idea.platform} />
                    <StatusBadge status={idea.status} />
                    <PriorityBadge priority={idea.priority} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
