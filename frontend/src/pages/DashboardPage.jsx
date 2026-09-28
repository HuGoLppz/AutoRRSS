import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import DashboardStats from "../components/dashboard/DashboardStats";
import DemoDataPanel from "../components/dashboard/DemoDataPanel";
import IdeaMiniList from "../components/dashboard/IdeaMiniList";
import ReminderList from "../components/dashboard/ReminderList";
import WeekStrip from "../components/dashboard/WeekStrip";
import DataGate from "../components/ui/DataGate";
import EmptyState from "../components/ui/EmptyState";
import { useReminders } from "../hooks/useReminders";
import { useIdeas } from "../store/IdeasContext";
import {
  groupByDay,
  selectRecent,
  selectStats,
  selectUpcoming,
} from "../store/selectors";
import { formatLong, todayISO } from "../utils/dates";

function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton" aria-hidden>
      <div className="skeleton skeleton--stat" />
      <div className="skeleton skeleton--stat" />
      <div className="skeleton skeleton--stat" />
      <div className="skeleton skeleton--stat" />
      <div className="skeleton skeleton--block" />
      <div className="skeleton skeleton--block" />
    </div>
  );
}

export default function DashboardPage() {
  const { ideas, status, error, reload } = useIdeas();
  const reminders = useReminders();

  const view = useMemo(
    () => ({
      stats: selectStats(ideas),
      upcoming: selectUpcoming(ideas).slice(0, 5),
      recent: selectRecent(ideas, 5),
      byDay: groupByDay(ideas),
    }),
    [ideas],
  );

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted capitalize">{formatLong(todayISO())}</p>
        </div>
        <div className="page__actions">
          <Link to="/generar" className="btn btn--primary btn--md">
            <Sparkles size={16} aria-hidden />
            <span>Generar idea</span>
          </Link>
        </div>
      </header>

      <DataGate
        status={status}
        error={error}
        onRetry={reload}
        skeleton={<DashboardSkeleton />}
      >
        {ideas.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Aún no tienes ideas"
            description="Genera tu primera idea con IA o restaura los datos de ejemplo para explorar la aplicación."
          >
            <Link to="/generar" className="btn btn--primary btn--md">
              <Sparkles size={16} aria-hidden />
              <span>Generar idea</span>
            </Link>
          </EmptyState>
        ) : (
          <>
            {reminders.length > 0 && (
              <section className="panel" aria-labelledby="dash-reminders">
                <h2 id="dash-reminders">Requiere tu atención</h2>
                <ReminderList reminders={reminders.slice(0, 5)} />
              </section>
            )}

            <DashboardStats stats={view.stats} />

            <section className="panel" aria-labelledby="dash-week">
              <div className="panel__head">
                <h2 id="dash-week">Próximos 7 días</h2>
                <Link to="/calendario" className="link">
                  Abrir calendario
                </Link>
              </div>
              <WeekStrip byDay={view.byDay} />
            </section>

            <div className="two-col">
              <section className="panel" aria-labelledby="dash-upcoming">
                <div className="panel__head">
                  <h2 id="dash-upcoming">Próximas publicaciones</h2>
                  <Link to="/calendario?view=agenda" className="link">
                    Ver agenda
                  </Link>
                </div>
                <IdeaMiniList
                  ideas={view.upcoming}
                  mode="date"
                  empty="No hay publicaciones próximas. Programa una idea desde su detalle."
                />
              </section>
              <section className="panel" aria-labelledby="dash-recent">
                <div className="panel__head">
                  <h2 id="dash-recent">Ideas recientes</h2>
                  <Link to="/ideas" className="link">
                    Ver todas
                  </Link>
                </div>
                <IdeaMiniList
                  ideas={view.recent}
                  mode="status"
                  empty="Todavía no has creado ideas."
                />
              </section>
            </div>
          </>
        )}
      </DataGate>

      {status === "ready" /*&& <DemoDataPanel />*/}
    </div>
  );
}
