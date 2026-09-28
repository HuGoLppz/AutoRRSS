/**
 * IdeasContext — estado de las ideas para toda la aplicación.
 *
 * Es la única capa que habla con `services/ideasService`. Los componentes
 * usan `useIdeas()` y nunca conocen si detrás hay localStorage o una API.
 * Gestiona: carga inicial, error, operaciones en curso por idea (guardando,
 * eliminando…) y avisos de éxito/error.
 */
import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import * as service from "../services/ideasService";
import { STATUS_META } from "../models/idea";
import { formatLong } from "../utils/dates";
import { useUI } from "./UIContext";

const IdeasContext = createContext(null);

export function IdeasProvider({ children }) {
  const { toast } = useUI();
  const [state, setState] = useState({ status: "loading", ideas: [], error: null });
  const [pending, setPending] = useState({});
  const ideasRef = useRef(state.ideas);
  ideasRef.current = state.ideas;

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: "loading", error: null }));
    try {
      const ideas = await service.getIdeas();
      setState({ status: "ready", ideas, error: null });
    } catch (error) {
      setState((s) => ({ ...s, status: "error", error: error.message }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upsert = useCallback((idea) => {
    setState((s) => ({
      ...s,
      ideas: s.ideas.some((i) => i.id === idea.id)
        ? s.ideas.map((i) => (i.id === idea.id ? idea : i))
        : [idea, ...s.ideas],
    }));
  }, []);

  /** Ejecuta una operación marcando la idea como "en curso". Devuelve null si falla. */
  const track = useCallback(
    async (key, kind, task, successMessage) => {
      setPending((p) => ({ ...p, [key]: kind }));
      try {
        const result = await task();
        if (successMessage) toast(successMessage(result));
        return result;
      } catch (error) {
        toast(error.message || "No se ha podido completar la acción.", "error");
        return null;
      } finally {
        setPending(({ [key]: _done, ...rest }) => rest);
      }
    },
    [toast],
  );

  const actions = useMemo(() => {
    const saveResult = (fn, message) => async (...args) => {
      const key = args[0];
      const idea = await track(key, "saving", () => fn(...args), message);
      if (idea) upsert(idea);
      return idea;
    };

    return {
      reload: load,

      createIdea: async (data) => {
        const idea = await track("new", "saving", () => service.createIdea(data), () => "Idea guardada");
        if (idea) upsert(idea);
        return idea;
      },

      /** `silent: true` omite el aviso (para ediciones rápidas como etiquetas o prioridad). */
      updateIdea: async (id, patch, { silent = false } = {}) => {
        const idea = await track(id, "saving", () => service.updateIdea(id, patch), silent ? undefined : () => "Cambios guardados");
        if (idea) upsert(idea);
        return idea;
      },

      setStatus: saveResult(
        service.updateIdeaStatus,
        (idea) => `Movida a «${STATUS_META[idea.status].label}»`,
      ),

      scheduleIdea: saveResult(
        service.scheduleIdea,
        (idea) => `Programada para el ${formatLong(idea.publishDate)}`,
      ),

      unscheduleIdea: saveResult(service.unscheduleIdea, () => "Programación cancelada"),

      deleteIdea: async (id) => {
        const done = await track(id, "deleting", () => service.deleteIdea(id), () => "Idea eliminada");
        if (done) setState((s) => ({ ...s, ideas: s.ideas.filter((i) => i.id !== id) }));
        return Boolean(done);
      },

      /** Optimista: la estrella cambia al instante y se revierte si falla. */
      toggleFavorite: async (id) => {
        const current = ideasRef.current.find((i) => i.id === id);
        if (!current) return null;
        upsert({ ...current, favorite: !current.favorite });
        try {
          const idea = await service.toggleFavorite(id);
          upsert(idea);
          return idea;
        } catch (error) {
          upsert(current);
          toast(error.message || "No se ha podido actualizar el favorito.", "error");
          return null;
        }
      },

      /** Carga una idea que no esté en memoria (p. ej. enlace directo con backend paginado). */
      loadIdea: async (id) => {
        try {
          const idea = await service.getIdeaById(id);
          upsert(idea);
          return idea;
        } catch {
          return null;
        }
      },

      resetDemoData: async () => {
        const ideas = await track("demo", "saving", service.resetDemoData, () => "Datos de ejemplo restaurados");
        if (ideas) setState({ status: "ready", ideas, error: null });
      },

      clearAll: async () => {
        const ideas = await track("demo", "saving", service.clearAllIdeas, () => "Biblioteca vaciada");
        if (ideas) setState({ status: "ready", ideas, error: null });
      },
    };
  }, [load, track, upsert, toast]);

  const value = useMemo(
    () => ({
      ...state,
      pending,
      isPending: (id) => pending[id] ?? null,
      ...actions,
    }),
    [state, pending, actions],
  );

  return <IdeasContext.Provider value={value}>{children}</IdeasContext.Provider>;
}

export function useIdeas() {
  const ctx = useContext(IdeasContext);
  if (!ctx) throw new Error("useIdeas debe usarse dentro de <IdeasProvider>");
  return ctx;
}
