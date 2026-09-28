/** Grupo de opciones excluyentes (radio) con aspecto de control segmentado. */
export default function SegmentedControl({
  options,
  value,
  onChange,
  label,
  size = "md",
  disabled = false,
}) {
  return (
    <div
      className={`segmented segmented--${size}`}
      role="radiogroup"
      aria-label={label}
    >
      {options.map((option) => {
        const Icon = option.icon;
        const checked = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={disabled}
            className={`segmented__item ${Icon ? "segmented__item--icon" : ""} ${checked ? "is-checked" : ""}`}
            aria-label={option.label}
            title={option.label}
            onClick={() => onChange(option.value)}
          >
            {Icon && <Icon size={15} aria-hidden />}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
