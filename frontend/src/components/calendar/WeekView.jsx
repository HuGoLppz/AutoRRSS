import { todayISO, weekDays } from "../../utils/dates";
import DayCell from "./DayCell";

export default function WeekView({ cursor, byDay, selectedDay, onSelectDay, onMoveIdea }) {
  const today = todayISO();
  return (
    <div className="cal-week" role="grid" aria-label="Calendario semanal">
      {weekDays(cursor).map((day) => (
        <DayCell
          key={day}
          day={day}
          today={today}
          showWeekday
          maxEvents={Infinity}
          events={byDay.get(day) ?? []}
          selected={day === selectedDay}
          onSelect={onSelectDay}
          onDropIdea={onMoveIdea}
        />
      ))}
    </div>
  );
}
