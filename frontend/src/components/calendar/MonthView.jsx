import { WEEKDAY_LABELS, isSameMonth, monthGrid, todayISO } from "../../utils/dates";
import DayCell from "./DayCell";

export default function MonthView({ cursor, byDay, selectedDay, onSelectDay, onMoveIdea }) {
  const today = todayISO();
  return (
    <div className="cal-grid" role="grid" aria-label="Calendario mensual">
      <div className="cal-grid__head" role="row">
        {WEEKDAY_LABELS.map((label) => <div key={label} role="columnheader">{label}</div>)}
      </div>
      <div className="cal-grid__body">
        {monthGrid(cursor).map((day) => (
          <DayCell
            key={day}
            day={day}
            today={today}
            events={byDay.get(day) ?? []}
            muted={!isSameMonth(day, cursor)}
            selected={day === selectedDay}
            onSelect={onSelectDay}
            onDropIdea={onMoveIdea}
          />
        ))}
      </div>
    </div>
  );
}
