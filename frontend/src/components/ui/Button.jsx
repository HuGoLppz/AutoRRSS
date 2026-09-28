import { Loader2 } from "lucide-react";

/** @param {{variant?: "primary"|"secondary"|"ghost"|"danger", size?: "sm"|"md"}} props */
export default function Button({
  variant = "secondary",
  size = "md",
  icon: Icon,
  loading = false,
  children,
  className = "",
  disabled,
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className="spin" aria-hidden />
      ) : (
        Icon && <Icon size={16} aria-hidden />
      )}
      {children && <span>{children}</span>}
    </button>
  );
}
