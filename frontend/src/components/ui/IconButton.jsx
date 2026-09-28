/** Botón solo icono. `label` es obligatorio (accesibilidad). */
export default function IconButton({
  icon: Icon, label, active = false, size = 18, className = "", type = "button", ...rest
}) {
  return (
    <button
      type={type}
      className={`icon-btn ${active ? "is-active" : ""} ${className}`}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon size={size} aria-hidden />
    </button>
  );
}
