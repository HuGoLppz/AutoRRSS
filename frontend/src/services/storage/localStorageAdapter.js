/**
 * Adaptador de almacenamiento local.
 *
 * ⚠️ ES EL ÚNICO ARCHIVO DEL FRONTEND QUE TOCA `localStorage`.
 * Cuando exista el backend Python, `ideasService` dejará de importar este
 * módulo y usará `fetch` en su lugar; el resto de la aplicación no cambia.
 *
 * Si localStorage no está disponible (modo privado, cuota llena) se usa un
 * Map en memoria para que la aplicación siga funcionando durante la sesión.
 */
import { MOCK_LATENCY_MS } from "../../config";

const memory = new Map();

function getStore() {
  try {
    const probe = "__autorrss_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

export const storage = {
  /** @returns {any|undefined} undefined si la clave no existe */
  read(key) {
    const store = getStore();
    const raw = store ? store.getItem(key) : memory.get(key);
    if (raw === null || raw === undefined) return undefined;
    try {
      return JSON.parse(raw);
    } catch {
      return undefined;
    }
  },

  write(key, value) {
    const raw = JSON.stringify(value);
    const store = getStore();
    if (store) store.setItem(key, raw);
    else memory.set(key, raw);
  },

  remove(key) {
    const store = getStore();
    if (store) store.removeItem(key);
    else memory.delete(key);
  },
};

/** Simula el tiempo de red de una petición. */
export const simulateLatency = () =>
  MOCK_LATENCY_MS > 0
    ? new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
    : Promise.resolve();
