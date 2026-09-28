import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import ScheduleDialog from "../calendar/ScheduleDialog";
import GlobalSearch from "./GlobalSearch";
import NotificationsMenu from "./NotificationsMenu";
import { NAV_ITEMS } from "./navigation";

/**
 * Estructura común: barra lateral (escritorio), raíl de iconos (tableta) o
 * barra inferior (móvil), buscador global y recordatorios.
 */
export default function AppShell() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="shell">
      <a className="skip-link" href="#main">Saltar al contenido</a>

      <nav className="nav" aria-label="Navegación principal">
        <div className="nav__brand">
          <span className="brand-mark" aria-hidden>A</span>
          <span className="nav__brand-name">AutoRRSS</span>
        </div>
        <ul className="nav__list">
          {NAV_ITEMS.map(({ to, label, shortLabel, icon: Icon, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className="nav__link" title={label}>
                <Icon size={20} aria-hidden />
                <span className="nav__label">{label}</span>
                <span className="nav__label-short" aria-hidden>{shortLabel ?? label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shell__content">
        <header className="topbar">
          <span className="brand-mark topbar__mark" aria-hidden>A</span>
          <GlobalSearch />
          <NotificationsMenu />
        </header>
        <main id="main" className="shell__main">
          <Outlet />
        </main>
      </div>

      <ScheduleDialog />
    </div>
  );
}
