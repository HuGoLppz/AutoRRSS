import { Link } from "react-router-dom";
import { AlertTriangle, CalendarClock, CalendarRange, CircleDashed, Lightbulb, PartyPopper, Sun } from "lucide-react";

const ICONS = {
  overdue: AlertTriangle, today: Sun, next: CalendarClock, upcoming: CalendarRange, undated: CircleDashed, pending: Lightbulb,
};

/** Lista de recordatorios visuales (dashboard y campana de la barra superior). */
export default function ReminderList({ reminders, onNavigate }) {
  if (reminders.length === 0) {
    return (
      <div className="reminders-empty">
        <PartyPopper size={20} aria-hidden />
        <p><strong>Todo al día</strong></p>
        <p className="muted">No hay publicaciones ni ideas que requieran atención.</p>
      </div>
    );
  }
  return (
    <ul className="reminders">
      {reminders.map((r) => {
        const Icon = ICONS[r.kind] ?? Lightbulb;
        return (
          <li key={r.id}>
            <Link to={r.to} className={`reminder reminder--${r.tone}`} onClick={onNavigate}>
              <span className="reminder__icon"><Icon size={16} aria-hidden /></span>
              <span className="reminder__text">
                <span className="reminder__title">{r.title}</span>
                <span className="reminder__detail">{r.detail}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
