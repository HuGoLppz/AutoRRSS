import { Search, X } from "lucide-react";

export default function SearchBar({
  value, onChange, onSubmit, placeholder = "Buscar ideas", inputRef, onFocus, label = "Buscar", className = "",
}) {
  return (
    <form
      className={`searchbar ${className}`}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value);
      }}
    >
      <Search size={16} aria-hidden />
      <input
        ref={inputRef}
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={label}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" className="searchbar__clear" aria-label="Borrar búsqueda" onClick={() => onChange("")}>
          <X size={14} aria-hidden />
        </button>
      )}
    </form>
  );
}
