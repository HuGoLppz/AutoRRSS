import { useMemo } from "react";
import { useIdeas } from "../store/IdeasContext";
import { selectReminders } from "../store/selectors";
import { todayISO } from "../utils/dates";

/** Recordatorios visuales derivados de las ideas (sin notificaciones del sistema). */
export function useReminders() {
  const { ideas } = useIdeas();
  return useMemo(() => selectReminders(ideas, todayISO()), [ideas]);
}
