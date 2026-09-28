import { useState } from "react";
import { useIdeas } from "../../store/IdeasContext";
import { useUI } from "../../store/UIContext";
import { addDays, formatLong, todayISO } from "../../utils/dates";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import { PlatformBadge, StatusBadge } from "../ideas/Badges";

/** Programar / reprogramar una idea. Se abre desde cualquier pantalla con `openSchedule(idea)`. */
export default function ScheduleDialog() {
  const { scheduleTarget, closeSchedule } = useUI();
  const { ideas } = useIdeas();
  if (!scheduleTarget) return null;
  const idea = ideas.find((i) => i.id === scheduleTarget.id) ?? scheduleTarget;
  return <ScheduleForm key={idea.id} idea={idea} onClose={closeSchedule} />;
}

function ScheduleForm({ idea, onClose }) {
  const { scheduleIdea, unscheduleIdea, isPending } = useIdeas();
  const [date, setDate] = useState(idea.publishDate ?? todayISO());
  const busy = Boolean(isPending(idea.id));
  const today = todayISO();
  const changesStatus =
    idea.status === "archived" || (!idea.publishDate && ["idea", "preparing"].includes(idea.status));

  const save = async () => {
    if (!date) return;
    if (await scheduleIdea(idea.id, date)) onClose();
  };
  const cancelSchedule = async () => {
    if (await unscheduleIdea(idea.id)) onClose();
  };

  const quick = [
    ["Hoy", today],
    ["Mañana", addDays(today, 1)],
    ["En una semana", addDays(today, 7)],
  ];

  return (
    <Dialog
      title={idea.publishDate ? "Cambiar fecha de publicación" : "Programar publicación"}
      onClose={onClose}
      footer={
        <>
          {idea.publishDate && idea.status !== "published" && (
            <Button variant="ghost" className="push-left" onClick={cancelSchedule} disabled={busy}>
              Cancelar programación
            </Button>
          )}
          <Button onClick={onClose}>Cerrar</Button>
          <Button variant="primary" onClick={save} loading={busy} disabled={!date}>
            {idea.publishDate ? "Guardar fecha" : "Programar"}
          </Button>
        </>
      }
    >
      <div className="schedule-target">
        <strong>{idea.title}</strong>
        <div className="row-gap"><PlatformBadge platform={idea.platform} /><StatusBadge status={idea.status} /></div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="schedule-date">Fecha de publicación</label>
        <input id="schedule-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} autoFocus />
        <div className="row-gap">
          {quick.map(([label, value]) => (
            <button key={label} type="button" className={`chip chip--toggle ${date === value ? "is-on" : ""}`} onClick={() => setDate(value)}>
              {label}
            </button>
          ))}
        </div>
        {date && <p className="field__hint">{formatLong(date)}</p>}
        {changesStatus && <p className="field__hint">La idea pasará a «Programada».</p>}
      </div>
    </Dialog>
  );
}
