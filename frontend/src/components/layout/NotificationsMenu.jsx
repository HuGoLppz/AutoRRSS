import { useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useDismiss } from "../../hooks/useDismiss";
import { useReminders } from "../../hooks/useReminders";
import IconButton from "../ui/IconButton";
import ReminderList from "../dashboard/ReminderList";

/** Campana con los recordatorios visuales (sin notificaciones reales del sistema). */
export default function NotificationsMenu() {
  const reminders = useReminders();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(ref, () => setOpen(false), open);

  const urgent = reminders.filter((r) => r.tone !== "neutral" && r.tone !== "info").length;

  return (
    <div className="notifications" ref={ref}>
      <IconButton
        icon={Bell}
        label={urgent ? `Recordatorios (${urgent} requieren atención)` : "Recordatorios"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      />
      {urgent > 0 && <span className="notifications__badge" aria-hidden>{urgent}</span>}
      {open && (
        <div className="popover notifications__panel">
          <h2 className="popover__title">Recordatorios</h2>
          <ReminderList reminders={reminders} onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
