import Button from "./Button";
import Dialog from "./Dialog";

export default function ConfirmDialog({
  title, message, confirmLabel = "Confirmar", tone = "primary", onConfirm, onCancel,
}) {
  return (
    <Dialog
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button onClick={onCancel}>Cancelar</Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="muted">{message}</p>
    </Dialog>
  );
}
