import { Link } from "react-router-dom";
import { addDays, formatWeekdayShort, parseISODate, todayISO } from "../../utils/dates";

/** Los próximos 7 días del calendario de un vistazo. */
export default function WeekStrip({ byDay }) {
  const today = todayISO();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  return (
    <ol className="week-strip">
      {days.map((day) => {
        const events = byDay.get(day) ?? [];
        return (
          <li key={day}>
            <Link
              to={`/calendario?view=week&date=${day}`}
              className={`week-strip__day ${day === today ? "is-today" : ""} ${events.length ? "has-events" : ""}`}
              aria-label={`${formatWeekdayShort(day)} ${parseISODate(day).getDate()}: ${events.length} publicaciones`}
            >
              <span className="week-strip__weekday">{formatWeekdayShort(day)}</span>
              <span className="week-strip__num">{parseISODate(day).getDate()}</span>
              <span className="week-strip__dots" aria-hidden>
                {events.slice(0, 3).map((idea) => <span key={idea.id} className={`dot dot--${idea.status}`} />)}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
