import { CalendarDays, LayoutDashboard, Lightbulb, Sparkles, Star } from "lucide-react";

/** Áreas principales de la aplicación (barra lateral y barra inferior en móvil). */
export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/generar", label: "Generar idea", shortLabel: "Generar", icon: Sparkles },
  { to: "/ideas", label: "Mis ideas", icon: Lightbulb },
  { to: "/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/favoritos", label: "Favoritos", icon: Star },
];
