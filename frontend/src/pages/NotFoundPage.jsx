import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import EmptyState from "../components/ui/EmptyState";

export default function NotFoundPage() {
  return (
    <div className="page">
      <EmptyState icon={Compass} title="Esta página no existe" description="Comprueba la dirección o vuelve al inicio.">
        <Link to="/" className="btn btn--primary btn--md"><span>Ir al Dashboard</span></Link>
      </EmptyState>
    </div>
  );
}
