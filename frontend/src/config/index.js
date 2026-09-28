/**
 * Configuración central del frontend.
 *
 * PUBLIC_API_URL se puede definir en `frontend/.env` (Rsbuild expone las
 * variables PUBLIC_*). Por defecto apunta al backend FastAPI actual.
 */
export const API_BASE_URL =
  import.meta.env.PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Latencia simulada (ms) del almacenamiento local. Sirve para poder ver los
 * estados "cargando / guardando / eliminando" mientras no hay backend real.
 * Ponla a 0 para desactivarla. Se elimina junto con el adaptador local.
 */
export const MOCK_LATENCY_MS = 90;

/** Máximo de peticiones simultáneas al generar varias ideas. */
export const GENERATION_CONCURRENCY = 3;
