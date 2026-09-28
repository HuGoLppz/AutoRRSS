import { CloudOff, RefreshCw } from "lucide-react";
import Button from "./Button";
import EmptyState from "./EmptyState";

/** Skeleton genérico de tarjetas mientras cargan los datos. */
export function CardSkeletons({ count = 6, layout = "grid" }) {
  return (
    <div className={layout === "list" ? "idea-list idea-list--list" : "idea-list idea-list--grid"} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton skeleton--card" />
      ))}
    </div>
  );
}

/** Muestra carga, error o contenido según el estado del store. */
export default function DataGate({ status, error, onRetry, skeleton = <CardSkeletons />, children }) {
  if (status === "loading") {
    return (
      <div aria-busy="true" aria-label="Cargando">
        {skeleton}
      </div>
    );
  }
  if (status === "error") {
    return (
      <EmptyState icon={CloudOff} title="No se han podido cargar tus ideas" description={error}>
        <Button icon={RefreshCw} onClick={onRetry}>Reintentar</Button>
      </EmptyState>
    );
  }
  return children;
}
