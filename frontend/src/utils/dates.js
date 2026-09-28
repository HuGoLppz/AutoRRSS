/**
 * Utilidades de fecha. Las fechas de publicación son cadenas "YYYY-MM-DD"
 * en hora local (sin zona horaria), igual que las guardará el backend en una
 * columna DATE. Los instantes (createdAt...) son ISO 8601 completos.
 */
const LOCALE = "es-ES";
const pad = (n) => String(n).padStart(2, "0");

export const toISODate = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseISODate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const isISODate = (value) =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

export const todayISO = () => toISODate(new Date());

export const addDays = (iso, n) => {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
};

export const addMonths = (iso, n) => {
  const d = parseISODate(iso);
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  return toISODate(d);
};

export const diffDays = (fromISO, toISO) =>
  Math.round((parseISODate(toISO) - parseISODate(fromISO)) / 86400000);

/** Lunes de la semana de la fecha dada (semana europea). */
export const startOfWeek = (iso) => {
  const d = parseISODate(iso);
  const offset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - offset);
  return toISODate(d);
};

export const startOfMonth = (iso) => `${iso.slice(0, 7)}-01`;

export const endOfMonth = (iso) => {
  const d = parseISODate(startOfMonth(iso));
  d.setMonth(d.getMonth() + 1, 0);
  return toISODate(d);
};

export const isSameMonth = (a, b) => a.slice(0, 7) === b.slice(0, 7);

/** Días (ISO) que ocupa la cuadrícula mensual: semanas completas lun-dom. */
export const monthGrid = (iso) => {
  const first = startOfWeek(startOfMonth(iso));
  const last = addDays(startOfWeek(endOfMonth(iso)), 6);
  const days = [];
  for (let d = first; d <= last; d = addDays(d, 1)) days.push(d);
  return days;
};

export const weekDays = (iso) => {
  const first = startOfWeek(iso);
  return Array.from({ length: 7 }, (_, i) => addDays(first, i));
};

const fmt = (options) => {
  const f = new Intl.DateTimeFormat(LOCALE, options);
  return (iso) => f.format(parseISODate(iso));
};

export const formatDay = fmt({ day: "numeric", month: "short" });
export const formatWeekdayShort = fmt({ weekday: "short" });
export const formatLong = fmt({ weekday: "long", day: "numeric", month: "long" });
export const formatMonthYear = fmt({ month: "long", year: "numeric" });
export const formatFull = fmt({ day: "numeric", month: "long", year: "numeric" });

export const formatWeekRange = (iso) => {
  const days = weekDays(iso);
  const a = parseISODate(days[0]);
  const b = parseISODate(days[6]);
  const sameMonth = a.getMonth() === b.getMonth();
  const dayFmt = new Intl.DateTimeFormat(LOCALE, { day: "numeric" });
  const dayMonthFmt = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short" });
  return sameMonth
    ? `${dayFmt.format(a)}–${dayMonthFmt.format(b)}`
    : `${dayMonthFmt.format(a)} – ${dayMonthFmt.format(b)}`;
};

/** Fecha relativa a hoy: "Hoy", "Mañana", "En 3 días", "Hace 2 días"… */
export const formatRelative = (iso, today = todayISO()) => {
  const n = diffDays(today, iso);
  if (n === 0) return "Hoy";
  if (n === 1) return "Mañana";
  if (n === -1) return "Ayer";
  if (n > 1 && n <= 14) return `En ${n} días`;
  if (n < -1 && n >= -14) return `Hace ${-n} días`;
  return formatDay(iso);
};

/** Instante ISO completo → "12 oct 2026". */
export const formatTimestamp = (isoTimestamp) =>
  new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(isoTimestamp),
  );

export const WEEKDAY_LABELS = weekDays("2026-01-05").map(formatWeekdayShort);
