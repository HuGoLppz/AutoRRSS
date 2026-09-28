/**
 * Selectores: derivan datos de presentación a partir de la lista de ideas.
 * Funciones puras, sin acceso a servicios ni a React. El dashboard, los
 * recordatorios y el calendario leen de aquí, así que siempre coinciden.
 */
import { isOpenStatus, STATUS_ORDER } from "../models/idea";
import { addDays, diffDays, todayISO } from "../utils/dates";

const byDateThenPriority = (a, b) =>
  a.publishDate.localeCompare(b.publishDate) || b.createdAt.localeCompare(a.createdAt);

/** Ideas con fecha que se muestran en el calendario (todas menos archivadas). */
export const selectCalendarIdeas = (ideas) =>
  ideas.filter((idea) => idea.publishDate && idea.status !== "archived");

/** Mapa "YYYY-MM-DD" → ideas de ese día. */
export function groupByDay(ideas) {
  const map = new Map();
  for (const idea of [...selectCalendarIdeas(ideas)].sort(byDateThenPriority)) {
    if (!map.has(idea.publishDate)) map.set(idea.publishDate, []);
    map.get(idea.publishDate).push(idea);
  }
  return map;
}

/** Ideas sin fecha que aún se pueden programar. */
export const selectSchedulable = (ideas) =>
  ideas.filter((idea) => !idea.publishDate && idea.status !== "published" && idea.status !== "archived");

export const selectUpcoming = (ideas, today = todayISO()) =>
  ideas
    .filter((idea) => idea.publishDate && isOpenStatus(idea.status) && idea.publishDate >= today)
    .sort(byDateThenPriority);

export const selectOverdue = (ideas, today = todayISO()) =>
  ideas
    .filter((idea) => idea.publishDate && isOpenStatus(idea.status) && idea.publishDate < today)
    .sort(byDateThenPriority);

export const selectRecent = (ideas, limit = 5) =>
  [...ideas].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);

export function selectStats(ideas) {
  const byStatus = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0]));
  for (const idea of ideas) byStatus[idea.status] += 1;
  return {
    total: ideas.length,
    byStatus,
    pending: byStatus.idea,
    scheduled: byStatus.scheduled,
    published: byStatus.published,
    favorites: ideas.filter((idea) => idea.favorite).length,
  };
}

/**
 * Recordatorios visuales. Cada uno lleva `to` (ruta a la que lleva) y `tone`
 * (danger | accent | warning | info | neutral) para el estilo. Cuando exista
 * un sistema de notificaciones real, esta misma lista puede venir del backend.
 */
export function selectReminders(ideas, today = todayISO()) {
  const reminders = [];
  const open = ideas.filter((idea) => isOpenStatus(idea.status));

  for (const idea of selectOverdue(ideas, today).slice(0, 3)) {
    const days = diffDays(idea.publishDate, today);
    reminders.push({
      id: `overdue-${idea.id}`, kind: "overdue", tone: "danger", to: `/ideas/${idea.id}`,
      title: idea.title,
      detail: `Debía publicarse hace ${days} ${days === 1 ? "día" : "días"}`,
    });
  }

  const todays = open.filter((idea) => idea.publishDate === today);
  for (const idea of todays) {
    reminders.push({
      id: `today-${idea.id}`, kind: "today", tone: "accent", to: `/ideas/${idea.id}`,
      title: idea.title, detail: `Se publica hoy en ${idea.platform}`,
    });
  }

  const [next] = selectUpcoming(ideas, addDays(today, 1));
  if (next) {
    const n = diffDays(today, next.publishDate);
    reminders.push({
      id: `next-${next.id}`, kind: "next", tone: "info", to: `/ideas/${next.id}`,
      title: next.title,
      detail: `Próxima publicación en ${next.platform} · ${n === 1 ? "mañana" : `en ${n} días`}`,
    });
  }

  const inWeek = selectUpcoming(ideas, today).filter((idea) => idea.publishDate <= addDays(today, 7));
  if (inWeek.length > 1) {
    reminders.push({
      id: "week", kind: "upcoming", tone: "info", to: "/calendario?view=agenda",
      title: `${inWeek.length} publicaciones en los próximos 7 días`,
      detail: "Abrir la agenda",
    });
  }

  const undated = open.filter(
    (idea) => !idea.publishDate && (idea.status === "preparing" || idea.status === "scheduled"),
  );
  for (const idea of undated.slice(0, 3)) {
    reminders.push({
      id: `undated-${idea.id}`, kind: "undated", tone: "warning", to: `/ideas/${idea.id}`,
      title: idea.title,
      detail: `${idea.status === "scheduled" ? "Programada" : "En preparación"} sin fecha de publicación`,
    });
  }

  const pending = ideas.filter((idea) => idea.status === "idea").length;
  if (pending > 0) {
    reminders.push({
      id: "pending", kind: "pending", tone: "neutral", to: "/ideas?status=idea",
      title: `${pending} ${pending === 1 ? "idea espera" : "ideas esperan"} a que las trabajes`,
      detail: "Ver ideas pendientes",
    });
  }

  return reminders;
}
