import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Sparkles } from "lucide-react";
import { useIdeas } from "../../store/IdeasContext";
import { selectSchedulable } from "../../store/selectors";
import { formatLong } from "../../utils/dates";
import { matchesQuery } from "../../utils/ideaQuery";
import Dialog from "../ui/Dialog";
import EmptyState from "../ui/EmptyState";
import SearchBar from "../ideas/SearchBar";
import { PlatformBadge, StatusBadge } from "../ideas/Badges";
import Button from "../ui/Button";

/** Elegir una idea sin fecha para programarla en el día seleccionado del calendario. */
export default function SchedulePicker({ day, onClose }) {
  const { ideas, scheduleIdea, isPending } = useIdeas();
  const [q, setQ] = useState("");
  const candidates = useMemo(() => selectSchedulable(ideas), [ideas]);
  const shown = candidates.filter((idea) => matchesQuery(idea, q));

  const pick = async (idea) => {
    if (await scheduleIdea(idea.id, day)) onClose();
  };

  return (
    <Dialog title={`Programar para el ${formatLong(day)}`} onClose={onClose} wide>
      {candidates.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No hay ideas sin fecha" description="Todas tus ideas activas ya están programadas. Genera nuevas ideas para seguir planificando.">
          <Link to="/generar" className="btn btn--primary btn--md" onClick={onClose}><Sparkles size={16} aria-hidden /><span>Generar idea</span></Link>
        </EmptyState>
      ) : (
        <>
          <SearchBar value={q} onChange={setQ} placeholder="Buscar entre tus ideas sin fecha" />
          <ul className="picker-list">
            {shown.map((idea) => (
              <li key={idea.id}>
                <div className="picker-item">
                  <div>
                    <strong>{idea.title}</strong>
                    <div className="row-gap"><PlatformBadge platform={idea.platform} /><StatusBadge status={idea.status} /></div>
                  </div>
                  <Button size="sm" variant="primary" loading={Boolean(isPending(idea.id))} onClick={() => pick(idea)}>Programar aquí</Button>
                </div>
              </li>
            ))}
            {shown.length === 0 && <li className="muted picker-empty">Ninguna idea coincide con la búsqueda.</li>}
          </ul>
        </>
      )}
    </Dialog>
  );
}
