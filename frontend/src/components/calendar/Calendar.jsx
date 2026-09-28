import { CalendarDays, ChevronLeft, ChevronRight, List, Rows3 } from "lucide-react";
import { formatMonthYear, formatWeekRange } from "../../utils/dates";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import SegmentedControl from "../ui/SegmentedControl";
import AgendaView from "./AgendaView";
import MonthView from "./MonthView";
import WeekView from "./WeekView";

const VIEWS = [
  { value: "month", label: "Mes", icon: CalendarDays },
  { value: "week", label: "Semana", icon: Rows3 },
  { value: "agenda", label: "Agenda", icon: List },
];

/** Calendario editorial: barra de navegación + vista mensual, semanal o de agenda. */
export default function Calendar({
  view, cursor, byDay, selectedDay, onViewChange, onStep, onToday, onSelectDay, onMoveIdea,
}) {
  const title = view === "week" ? formatWeekRange(cursor) : formatMonthYear(cursor);
  const stepLabel = view === "week" ? "semana" : "mes";
  const shared = { cursor, byDay, selectedDay, onSelectDay, onMoveIdea };

  return (
    <section className="calendar">
      <div className="calendar__toolbar">
        <h2 className="calendar__title" aria-live="polite">{title}</h2>
        <div className="calendar__nav">
          <IconButton icon={ChevronLeft} label={`Anterior ${stepLabel}`} onClick={() => onStep(-1)} />
          <Button size="sm" onClick={onToday}>Hoy</Button>
          <IconButton icon={ChevronRight} label={`Siguiente ${stepLabel}`} onClick={() => onStep(1)} />
        </div>
        <SegmentedControl label="Vista del calendario" options={VIEWS} value={view} onChange={onViewChange} />
      </div>

      {view === "month" && <MonthView {...shared} />}
      {view === "week" && <WeekView {...shared} />}
      {view === "agenda" && <AgendaView cursor={cursor} byDay={byDay} />}
    </section>
  );
}
