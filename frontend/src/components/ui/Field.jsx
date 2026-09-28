import { useId } from "react";

/** Etiqueta + control + mensaje de error/ayuda enlazados por accesibilidad. */
export default function Field({ label, error, hint, children, className = "" }) {
  const id = useId();
  return (
    <div className={`field ${error ? "has-error" : ""} ${className}`}>
      <label className="field__label" htmlFor={id}>{label}</label>
      {children(id)}
      {error ? <p className="field__error" role="alert">{error}</p> : hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}
