import { useEffect, useState } from "react";
import { useIdeas } from "../store/IdeasContext";

/**
 * Una idea concreta por id. Lee de la lista en memoria y, si no está
 * (enlace directo, backend paginado…), la pide con `getIdeaById`.
 *
 * @returns {{idea: import("../models/idea").Idea|null, state: "loading"|"ready"|"missing"|"error"}}
 */
export function useIdea(id) {
  const { ideas, status, loadIdea } = useIdeas();
  const idea = ideas.find((item) => item.id === id) ?? null;
  const [lookup, setLookup] = useState({ id: null, found: null });

  useEffect(() => {
    if (status !== "ready" || idea) return;
    let cancelled = false;
    loadIdea(id).then((found) => {
      if (!cancelled) setLookup({ id, found: Boolean(found) });
    });
    return () => {
      cancelled = true;
    };
  }, [id, status, idea, loadIdea]);

  let state = "loading";
  if (idea) state = "ready";
  else if (status === "error") state = "error";
  else if (status === "ready" && lookup.id === id && lookup.found === false) state = "missing";

  return { idea, state };
}
