/**
 * Estado de interfaz compartido: avisos (toasts), diálogo de confirmación y
 * diálogo de programación. No contiene datos de negocio.
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ToastViewport from "../components/ui/ToastViewport";

const UIContext = createContext(null);
const TOAST_MS = 3600;

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const [scheduleTarget, setScheduleTarget] = useState(null);
  const nextId = useRef(1);

  const dismissToast = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  /** @param {"success"|"error"|"info"} tone */
  const toast = useCallback(
    (message, tone = "success") => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-2), { id, message, tone }]);
      setTimeout(() => dismissToast(id), tone === "error" ? TOAST_MS * 1.6 : TOAST_MS);
    },
    [dismissToast],
  );

  /** Pide confirmación. Devuelve una promesa con true/false. */
  const confirm = useCallback(
    (options) => new Promise((resolve) => setConfirmState({ ...options, resolve })),
    [],
  );

  const settleConfirm = (result) => {
    confirmState?.resolve(result);
    setConfirmState(null);
  };

  const value = useMemo(
    () => ({
      toast,
      confirm,
      scheduleTarget,
      openSchedule: (idea) => setScheduleTarget(idea),
      closeSchedule: () => setScheduleTarget(null),
    }),
    [toast, confirm, scheduleTarget],
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
      {confirmState && (
        <ConfirmDialog
          {...confirmState}
          onConfirm={() => settleConfirm(true)}
          onCancel={() => settleConfirm(false)}
        />
      )}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI debe usarse dentro de <UIProvider>");
  return ctx;
}
