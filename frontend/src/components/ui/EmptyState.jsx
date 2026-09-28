export default function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="empty">
      {Icon && (
        <span className="empty__icon">
          <Icon size={22} aria-hidden />
        </span>
      )}
      <h3>{title}</h3>
      {description && <p className="muted">{description}</p>}
      {children && <div className="empty__actions">{children}</div>}
    </div>
  );
}
