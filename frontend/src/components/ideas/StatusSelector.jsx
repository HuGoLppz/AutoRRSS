import { STATUS_META, STATUS_ORDER, WORKFLOW_STATUSES } from "../../models/idea";

/**
 * Selector de estado.
 *  - variant="steps": muestra el flujo Idea → En preparación → Programada →
 *    Publicada, con "Archivada" aparte. Para el detalle.
 *  - variant="select": desplegable compacto. Para formularios y filas.
 */
export default function StatusSelector({ value, onChange, variant = "steps", disabled = false, id }) {
  if (variant === "select") {
    return (
      <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        {STATUS_ORDER.map((status) => (
          <option key={status} value={status}>{STATUS_META[status].label}</option>
        ))}
      </select>
    );
  }

  const currentIndex = WORKFLOW_STATUSES.indexOf(value);
  return (
    <div className="status-steps" role="radiogroup" aria-label="Estado">
      <ol className="status-steps__flow">
        {WORKFLOW_STATUSES.map((status, index) => {
          const checked = status === value;
          const done = currentIndex > index;
          return (
            <li key={status}>
              <button
                type="button"
                role="radio"
                aria-checked={checked}
                disabled={disabled}
                className={`step step--${status} ${checked ? "is-current" : ""} ${done ? "is-done" : ""}`}
                onClick={() => onChange(status)}
              >
                <span className="step__dot" aria-hidden />
                <span className="step__label">{STATUS_META[status].label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        role="radio"
        aria-checked={value === "archived"}
        disabled={disabled}
        className={`step step--archived step--alone ${value === "archived" ? "is-current" : ""}`}
        onClick={() => onChange("archived")}
      >
        <span className="step__dot" aria-hidden />
        <span className="step__label">Archivada</span>
      </button>
    </div>
  );
}
