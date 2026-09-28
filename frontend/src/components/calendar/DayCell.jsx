import { useState } from "react";
import { formatWeekdayShort, parseISODate } from "../../utils/dates";
import CalendarEvent from "./CalendarEvent";

/** Celda de un día (mes y semana). Acepta ideas arrastradas para reprogramarlas. */
export default function DayCell({
  day, events, today, selected, muted = false, maxEvents = 3, showWeekday = false, onSelect, onDropIdea,
}) {
  const [over, setOver] = useState(false);
  const shown = events.slice(0, maxEvents);
  const hidden = events.length - shown.length;
  const number = parseISODate(day).getDate();

  return (
    <div
      role="gridcell"
      aria-selected={selected}
      className={`day-cell ${muted ? "is-muted" : ""} ${selected ? "is-selected" : ""} ${day === today ? "is-today" : ""} ${over ? "is-over" : ""}`}
      onClick={() => onSelect(day)}
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        const id = event.dataTransfer.getData("text/plain");
        if (id) onDropIdea(id, day);
      }}
    >
      <button type="button" className="day-cell__number" onClick={() => onSelect(day)} aria-label={`${number}, ${events.length} publicaciones`}>
        {showWeekday && <span className="day-cell__weekday">{formatWeekdayShort(day)}</span>}
        {number}
      </button>
      <div className="day-cell__events">
        {shown.map((idea) => <CalendarEvent key={idea.id} idea={idea} />)}
        {hidden > 0 && <span className="day-cell__more">+{hidden} más</span>}
      </div>
      {events.length > 0 && (
        <div className="day-cell__dots" aria-hidden>
          {events.slice(0, 4).map((idea) => <span key={idea.id} className={`dot dot--${idea.status}`} />)}
        </div>
      )}
    </div>
  );
}
