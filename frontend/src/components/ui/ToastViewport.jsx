import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };

export default function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.tone] ?? Info;
        return (
          <div key={toast.id} className={`toast toast--${toast.tone}`}>
            <Icon size={18} aria-hidden />
            <span>{toast.message}</span>
            <button className="toast__close" aria-label="Cerrar aviso" onClick={() => onDismiss(toast.id)}>
              <X size={14} aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
