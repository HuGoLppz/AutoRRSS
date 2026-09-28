import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDismiss } from "../../hooks/useDismiss";
import { useIdeas } from "../../store/IdeasContext";
import { matchesQuery } from "../../utils/ideaQuery";
import { PlatformBadge, StatusBadge } from "../ideas/Badges";
import SearchBar from "../ideas/SearchBar";

/**
 * Buscador global: resultados al instante bajo el campo; Enter abre la
 * biblioteca con la búsqueda aplicada (donde se pueden combinar filtros).
 * Atajo: Ctrl/⌘ + K.
 */
export default function GlobalSearch() {
  const { ideas } = useIdeas();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  useDismiss(wrapRef, () => setOpen(false), open);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const matches = useMemo(() => (q.trim() ? ideas.filter((i) => matchesQuery(i, q)) : []), [ideas, q]);

  const close = () => {
    setOpen(false);
    setQ("");
  };
  const submit = (value) => {
    if (!value.trim()) return;
    navigate(`/ideas?q=${encodeURIComponent(value.trim())}`);
    close();
    inputRef.current?.blur();
  };

  return (
    <div className="global-search" ref={wrapRef}>
      <SearchBar
        value={q}
        inputRef={inputRef}
        label="Buscar en todo el contenido"
        placeholder="Buscar ideas (Ctrl K)"
        onChange={(value) => {
          setQ(value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onSubmit={submit}
      />
      {open && q.trim() && (
        <div className="popover global-search__results" role="listbox" aria-label="Resultados">
          {matches.length === 0 ? (
            <p className="muted popover__empty">Sin resultados para «{q.trim()}».</p>
          ) : (
            <>
              <ul>
                {matches.slice(0, 6).map((idea) => (
                  <li key={idea.id}>
                    <Link to={`/ideas/${idea.id}`} onClick={close} className="result">
                      <span className="result__title">{idea.title}</span>
                      <span className="row-gap"><PlatformBadge platform={idea.platform} /><StatusBadge status={idea.status} /></span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button type="button" className="popover__footer" onClick={() => submit(q)}>
                Ver los {matches.length} {matches.length === 1 ? "resultado" : "resultados"} en Mis ideas
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
