/**
 * ideasService — ÚNICO punto de acceso a los datos de ideas.
 *
 * Habla con el backend Python (FastAPI + SQLite) por HTTP. Los componentes
 * React nunca hacen fetch directamente: llaman a estas funciones (a través
 * de `store/IdeasContext`) y no conocen los detalles de transporte.
 *
 * Contrato con el backend (ver `backend/autorrss/routers/ideas.py`):
 *   getIdeas()                 → GET    /ideas
 *   getIdeaById(id)            → GET    /ideas/{id}
 *   createIdea(data)           → POST   /ideas
 *   updateIdea(id, patch)      → PATCH  /ideas/{id}
 *   deleteIdea(id)             → DELETE /ideas/{id}
 *   scheduleIdea(id, date)     → POST   /ideas/{id}/schedule   {publishDate}
 *   unscheduleIdea(id)         → DELETE /ideas/{id}/schedule
 *   updateIdeaStatus(id, s)    → POST   /ideas/{id}/status     {status}
 *   toggleFavorite(id)         → POST   /ideas/{id}/favorite
 *   resetDemoData()            → POST   /ideas/demo/reset
 *   clearAllIdeas()            → DELETE /ideas
 *
 * Las reglas de negocio (transiciones de estado, timestamps, normalización
 * de etiquetas) las aplica el backend (`backend/autorrss/domain.py`); aquí
 * solo se traduce HTTP ⇄ promesas y se homogenizan los errores.
 *
 * @typedef {import("../models/idea").Idea} Idea
 */
import { API_BASE_URL } from "../config";

export class ServiceError extends Error {
  /** @param {string} message @param {"not_found"|"invalid"|"network"} code */
  constructor(message, code) {
    super(message);
    this.name = "ServiceError";
    this.code = code;
  }
}

/** Extrae un mensaje legible del cuerpo de error de FastAPI ({detail: string|object|array}). */
function readErrorMessage(data) {
  const detail = data?.detail;
  if (typeof detail === "string") return detail;
  if (detail && typeof detail.message === "string") return detail.message; // errores de /generate
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg; // 422 de validación de Pydantic
  return "No se ha podido completar la operación.";
}

async function request(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ServiceError("No se ha podido conectar con el servidor. Comprueba que el backend está en marcha.", "network");
  }

  if (response.status === 204) return null;

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* respuesta sin cuerpo JSON (poco común) */
  }

  if (!response.ok) {
    throw new ServiceError(readErrorMessage(data), response.status === 404 ? "not_found" : "invalid");
  }
  return data;
}

/** @returns {Promise<Idea[]>} */
export const getIdeas = () => request("/ideas");

/** @returns {Promise<Idea>} */
export const getIdeaById = (id) => request(`/ideas/${id}`);

/** @param {Partial<Idea>} data @returns {Promise<Idea>} */
export const createIdea = (data) => request("/ideas", { method: "POST", body: data });

/** @returns {Promise<Idea>} */
export const updateIdea = (id, patch) => request(`/ideas/${id}`, { method: "PATCH", body: patch });

/** @returns {Promise<string>} el id eliminado */
export const deleteIdea = async (id) => {
  await request(`/ideas/${id}`, { method: "DELETE" });
  return id;
};

/** @returns {Promise<Idea>} */
export const updateIdeaStatus = (id, status) => request(`/ideas/${id}/status`, { method: "POST", body: { status } });

/** @returns {Promise<Idea>} */
export const toggleFavorite = (id) => request(`/ideas/${id}/favorite`, { method: "POST" });

/** @returns {Promise<Idea>} */
export const scheduleIdea = (id, date) =>
  request(`/ideas/${id}/schedule`, { method: "POST", body: { publishDate: date } });

/** @returns {Promise<Idea>} */
export const unscheduleIdea = (id) => request(`/ideas/${id}/schedule`, { method: "DELETE" });

/* ---------------------------- datos de demostración ---------------------------- */
// Utilidades para probar la aplicación sin partir de cero. El backend las
// implementa como endpoints normales (no hay mock por debajo).

/** Restaura los datos de ejemplo (sustituye lo que haya en el servidor). */
export const resetDemoData = () => request("/ideas/demo/reset", { method: "POST" });

/** Vacía la biblioteca (útil para probar los estados vacíos). */
export const clearAllIdeas = () => request("/ideas", { method: "DELETE" });
