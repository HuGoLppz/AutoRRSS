import { Star } from "lucide-react";
import { useIdeas } from "../../store/IdeasContext";

/** Estrella de favorito conectada al store (actualización optimista). */
export default function FavoriteButton({ idea, size = 18, withLabel = false }) {
  const { toggleFavorite } = useIdeas();
  const label = idea.favorite ? "Quitar de favoritas" : "Marcar como favorita";
  return (
    <button
      type="button"
      className={`fav ${idea.favorite ? "is-on" : ""} ${withLabel ? "fav--labeled" : ""}`}
      aria-pressed={idea.favorite}
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(idea.id);
      }}
    >
      <Star size={size} aria-hidden fill={idea.favorite ? "currentColor" : "none"} />
      {withLabel && <span>{idea.favorite ? "Favorita" : "Añadir a favoritas"}</span>}
    </button>
  );
}
