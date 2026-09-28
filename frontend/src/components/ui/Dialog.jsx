import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import IconButton from "./IconButton";

/**
 * Diálogo modal basado en <dialog>: foco atrapado, Escape y fondo gestionados
 * por el navegador. En móvil se presenta como hoja inferior.
 */
export default function Dialog({ title, onClose, children, footer, wide = false }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={`dialog ${wide ? "dialog--wide" : ""}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onMouseDown={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="dialog__panel">
        <header className="dialog__header">
          <h2 id={titleId}>{title}</h2>
          <IconButton icon={X} label="Cerrar" onClick={onClose} />
        </header>
        <div className="dialog__body">{children}</div>
        {footer && <footer className="dialog__footer">{footer}</footer>}
      </div>
    </dialog>
  );
}
