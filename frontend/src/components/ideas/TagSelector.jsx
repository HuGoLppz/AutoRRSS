import { useId, useState } from "react";
import { Plus, X } from "lucide-react";
import { normalizeTag } from "../../models/idea";

/**
 * Editor de etiquetas: Enter o coma añaden, Retroceso quita la última.
 * `suggestions` son etiquetas ya usadas (o hashtags generados) que se añaden
 * con un clic.
 */
export default function TagSelector({ value, onChange, suggestions = [], label = "Etiquetas" }) {
  const [draft, setDraft] = useState("");
  const inputId = useId();

  const add = (raw) => {
    const tag = normalizeTag(raw);
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft("");
  };
  const remove = (tag) => onChange(value.filter((t) => t !== tag));

  const available = suggestions
    .map(normalizeTag)
    .filter((tag, i, all) => tag && !value.includes(tag) && all.indexOf(tag) === i)
    .slice(0, 8);

  return (
    <div className="tags-editor">
      <div className="tags-editor__box">
        {value.map((tag) => (
          <span key={tag} className="chip chip--removable">
            {tag}
            <button type="button" aria-label={`Quitar etiqueta ${tag}`} onClick={() => remove(tag)}>
              <X size={12} aria-hidden />
            </button>
          </span>
        ))}
        <input
          id={inputId}
          aria-label={label}
          value={draft}
          placeholder={value.length ? "Añadir…" : "Escribe y pulsa Enter"}
          onChange={(e) => {
            if (e.target.value.endsWith(",")) add(e.target.value);
            else setDraft(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) {
              remove(value[value.length - 1]);
            }
          }}
          onBlur={() => draft && add(draft)}
        />
      </div>
      {available.length > 0 && (
        <div className="tags-editor__suggestions" aria-label="Etiquetas sugeridas">
          {available.map((tag) => (
            <button key={tag} type="button" className="chip chip--suggest" onClick={() => add(tag)}>
              <Plus size={12} aria-hidden />
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
