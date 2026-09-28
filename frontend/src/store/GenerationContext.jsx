/**
 * GenerationContext — sesión de generación con Gemini.
 *
 * Guarda los borradores generados (aún NO guardados en la biblioteca) para
 * que sobrevivan al cambiar de página. Una generación nunca crea ideas por
 * sí sola: el usuario revisa cada borrador y decide guardarlo.
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { generateIdeas } from "../services/generationService";
import {
  DEFAULT_GENERATOR_PARAMS, loadGeneratorParams, saveGeneratorParams,
} from "../services/preferencesService";
import { ideaValuesFromGeneration } from "../models/idea";
import { useIdeas } from "./IdeasContext";

const GenerationContext = createContext(null);

const uid = () => `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function GenerationProvider({ children }) {
  const { createIdea } = useIdeas();
  const [params, setParams] = useState(loadGeneratorParams);
  const [count, setCount] = useState(1);
  const [drafts, setDrafts] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;

  const patchDraft = useCallback((localId, patch) => {
    setDrafts((list) => list.map((d) => (d.localId === localId ? { ...d, ...patch } : d)));
  }, []);

  const generate = useCallback(async () => {
    setStatus("loading");
    setError("");
    setNotice("");
    setDrafts([]);
    saveGeneratorParams(params);
    try {
      const { results, failed } = await generateIdeas(params, count);
      setDrafts(
        results.map((result) => ({
          localId: uid(),
          values: ideaValuesFromGeneration(result, params),
          savedId: null,
          saving: false,
        })),
      );
      if (failed > 0) {
        setNotice(`Se han generado ${results.length} de ${count} ideas. Las demás han fallado.`);
      } else if (results.length < count) {
        setNotice(`Se han generado ${results.length} de ${count} ideas: el resto eran repetidas.`);
      }
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }, [params, count]);

  const updateDraft = useCallback((localId, values) => patchDraft(localId, { values }), [patchDraft]);

  const saveDraft = useCallback(
    async (localId, values) => {
      const draft = draftsRef.current.find((d) => d.localId === localId);
      if (!draft || draft.savedId) return null;
      patchDraft(localId, { saving: true, values });
      const idea = await createIdea(values);
      patchDraft(localId, { saving: false, savedId: idea?.id ?? null });
      return idea;
    },
    [createIdea, patchDraft],
  );

  const saveAll = useCallback(async () => {
    for (const draft of draftsRef.current.filter((d) => !d.savedId)) {
      await saveDraft(draft.localId, draft.values);
    }
  }, [saveDraft]);

  const discardDraft = useCallback((localId) => {
    setDrafts((list) => list.filter((d) => d.localId !== localId));
  }, []);

  const reset = useCallback(() => {
    setDrafts([]);
    setStatus("idle");
    setError("");
    setNotice("");
  }, []);

  const value = useMemo(
    () => ({
      params, setParams, count, setCount, drafts, status, error, notice,
      generate, updateDraft, saveDraft, saveAll, discardDraft, reset,
      defaults: DEFAULT_GENERATOR_PARAMS,
    }),
    [params, count, drafts, status, error, notice, generate, updateDraft, saveDraft, saveAll, discardDraft, reset],
  );

  return <GenerationContext.Provider value={value}>{children}</GenerationContext.Provider>;
}

export function useGeneration() {
  const ctx = useContext(GenerationContext);
  if (!ctx) throw new Error("useGeneration debe usarse dentro de <GenerationProvider>");
  return ctx;
}
