import { Database } from "lucide-react";
import { useIdeas } from "../../store/IdeasContext";
import { useUI } from "../../store/UIContext";
import Button from "../ui/Button";

/** Herramientas de la fase sin backend: restaurar datos de ejemplo o vaciar la biblioteca. */
export default function DemoDataPanel() {
  const { resetDemoData, clearAll, isPending } = useIdeas();
  const { confirm } = useUI();
  const busy = Boolean(isPending("demo"));

  const reset = async () => {
    const ok = await confirm({
      title: "Restaurar datos de ejemplo",
      message: "Se sustituirán todas tus ideas actuales por los datos de ejemplo.",
      confirmLabel: "Restaurar",
    });
    if (ok) resetDemoData();
  };
  const clear = async () => {
    const ok = await confirm({
      title: "Vaciar la biblioteca",
      message: "Se eliminarán todas las ideas guardadas en este navegador. No se puede deshacer.",
      confirmLabel: "Vaciar todo",
      tone: "danger",
    });
    if (ok) clearAll();
  };

  return (
    <section className="demo-panel" aria-label="Datos de demostración">
      <Database size={18} aria-hidden />
      <div>
        <strong>Datos de demostración</strong>
        <p className="muted">Tus ideas se guardan en el servidor (backend Python + SQLite).</p>
      </div>
      <div className="demo-panel__actions">
        <Button size="sm" onClick={reset} disabled={busy}>Restaurar ejemplos</Button>
        <Button size="sm" variant="ghost" onClick={clear} disabled={busy}>Vaciar</Button>
      </div>
    </section>
  );
}
