import { Link } from "react-router-dom";
import { STATUS_META, STATUS_ORDER } from "../../models/idea";

const TILES = [
  { key: "total", label: "Ideas en total", to: "/ideas" },
  { key: "pending", label: "Pendientes", to: "/ideas?status=idea", hint: "Sin trabajar" },
  { key: "scheduled", label: "Programadas", to: "/ideas?status=scheduled", hint: "Con fecha" },
  { key: "published", label: "Publicadas", to: "/ideas?status=published", hint: "Ya online" },
];

export default function DashboardStats({ stats }) {
  return (
    <section aria-label="Resumen de contenido">
      <ul className="stat-grid">
        {TILES.map((tile) => (
          <li key={tile.key}>
            <Link to={tile.to} className="stat">
              <span className="stat__value">{stats[tile.key]}</span>
              <span className="stat__label">{tile.label}</span>
              {tile.hint && <span className="stat__hint">{tile.hint}</span>}
            </Link>
          </li>
        ))}
      </ul>

      {stats.total > 0 && (
        <div className="pipeline" aria-label="Reparto por estado">
          <div className="pipeline__bar" role="img" aria-label={STATUS_ORDER.map((s) => `${STATUS_META[s].label}: ${stats.byStatus[s]}`).join(", ")}>
            {STATUS_ORDER.filter((s) => stats.byStatus[s] > 0).map((s) => (
              <span key={s} className={`pipeline__seg dot--${s}`} style={{ flexGrow: stats.byStatus[s] }} />
            ))}
          </div>
          <ul className="pipeline__legend">
            {STATUS_ORDER.map((s) => (
              <li key={s}><span className={`dot dot--${s}`} aria-hidden />{STATUS_META[s].label} <b>{stats.byStatus[s]}</b></li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
