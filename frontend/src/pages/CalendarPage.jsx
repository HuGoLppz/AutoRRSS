import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Calendar from "../components/calendar/Calendar";
import DayPanel from "../components/calendar/DayPanel";
import SchedulePicker from "../components/calendar/SchedulePicker";
import DataGate from "../components/ui/DataGate";
import { useIdeas } from "../store/IdeasContext";
import { groupByDay } from "../store/selectors";
import { addDays, addMonths, isISODate, todayISO } from "../utils/dates";

const VIEWS = ["month", "week", "agenda"];

/**
 * Calendario editorial. Vista y fecha viven en la URL
 * (/calendario?view=week&date=2026-10-12) para poder enlazar desde el dashboard.
 */
export default function CalendarPage() {
  const { ideas, status, error, reload, scheduleIdea } = useIdeas();
  const [params, setParams] = useSearchParams();

  const view = VIEWS.includes(params.get("view")) ? params.get("view") : "month";
  const cursor = isISODate(params.get("date")) ? params.get("date") : todayISO();

  const [selectedDay, setSelectedDay] = useState(cursor);
  const [picking, setPicking] = useState(false);
  useEffect(() => setSelectedDay(cursor), [cursor]);

  const byDay = useMemo(() => groupByDay(ideas), [ideas]);

  const go = useCallback(
    (next) => setParams((prev) => {
      const p = new URLSearchParams(prev);
      Object.entries(next).forEach(([k, v]) => p.set(k, v));
      return p;
    }, { replace: true }),
    [setParams],
  );

  const step = (dir) => go({ date: view === "week" ? addDays(cursor, 7 * dir) : addMonths(cursor, dir) });

  return (
    <div className="page page--wide">
      <header className="page__header">
        <div>
          <h1>Calendario</h1>
          <p className="muted">Arrastra una publicación a otro día para reprogramarla.</p>
        </div>
      </header>

      <DataGate status={status} error={error} onRetry={reload} skeleton={<div className="skeleton skeleton--calendar" />}>
        <div className={`calendar-layout ${view === "agenda" ? "is-agenda" : ""}`}>
          <Calendar
            view={view}
            cursor={cursor}
            byDay={byDay}
            selectedDay={selectedDay}
            onViewChange={(v) => go({ view: v })}
            onStep={step}
            onToday={() => go({ date: todayISO() })}
            onSelectDay={setSelectedDay}
            onMoveIdea={(id, day) => {
              const idea = ideas.find((i) => i.id === id);
              if (idea && idea.publishDate !== day) scheduleIdea(id, day);
            }}
          />
          {view !== "agenda" && (
            <DayPanel day={selectedDay} ideas={byDay.get(selectedDay) ?? []} onAdd={() => setPicking(true)} />
          )}
        </div>
      </DataGate>

      {picking && <SchedulePicker day={selectedDay} onClose={() => setPicking(false)} />}
    </div>
  );
}
