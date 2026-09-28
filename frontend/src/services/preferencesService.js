/**
 * Preferencias locales del generador (últimos datos de empresa usados).
 * Sirve para no reescribir empresa/sector/público cada vez. Con backend
 * pasaría a ser parte del perfil del usuario/empresa.
 */
import { storage } from "./storage/localStorageAdapter";

const KEY = "autorrss:generator-params:v1";

export const DEFAULT_GENERATOR_PARAMS = {
  company: "",
  sector: "",
  audience: "",
  platform: "TikTok",
  contentType: "Vídeo corto",
};

export function loadGeneratorParams() {
  return { ...DEFAULT_GENERATOR_PARAMS, ...(storage.read(KEY) ?? {}) };
}

export function saveGeneratorParams(params) {
  try {
    storage.write(KEY, params);
  } catch {
    /* preferencia opcional: si falla no pasa nada */
  }
}
