/**
 * Modelo de datos de una idea + constantes de dominio.
 *
 * Este archivo es el "contrato" entre la interfaz, los servicios y el futuro
 * backend Python: si mañana el backend devuelve estos mismos campos (JSON),
 * los componentes no cambian.
 *
 * @typedef {"idea"|"preparing"|"scheduled"|"published"|"archived"} IdeaStatus
 * @typedef {"low"|"medium"|"high"} IdeaPriority
 *
 * @typedef {Object} GeneratedContent   Respuesta de Gemini (/generate)
 * @property {string} hook
 * @property {string} script
 * @property {string} caption
 * @property {string[]} hashtags
 *
 * @typedef {Object} GenerationSource   Datos del formulario que originó la idea
 * @property {string} company
 * @property {string} sector
 * @property {string} audience
 *
 * @typedef {Object} Idea
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {string} platform
 * @property {string} contentType
 * @property {IdeaStatus} status
 * @property {IdeaPriority} priority
 * @property {string[]} tags
 * @property {string} notes
 * @property {boolean} favorite
 * @property {string} createdAt       ISO 8601 con hora
 * @property {string} updatedAt       ISO 8601 con hora
 * @property {string|null} publishDate  "YYYY-MM-DD" (fecha prevista o real)
 * @property {string|null} publishedAt  ISO 8601, cuando pasó a "Publicada"
 * @property {GeneratedContent|null} generated
 * @property {GenerationSource|null} source
 */

export const PLATFORMS = ["TikTok", "Instagram", "YouTube", "LinkedIn"];
export const CONTENT_TYPES = ["Vídeo corto", "Publicación", "Historia", "Artículo"];
export const GENERATION_COUNTS = [1, 3, 5, 10];

/** Orden = flujo de trabajo. "archived" queda fuera del flujo principal. */
export const STATUS_ORDER = ["idea", "preparing", "scheduled", "published", "archived"];
export const WORKFLOW_STATUSES = ["idea", "preparing", "scheduled", "published"];

export const STATUS_META = {
  idea: { label: "Idea", hint: "Sin trabajar todavía" },
  preparing: { label: "En preparación", hint: "Se está creando" },
  scheduled: { label: "Programada", hint: "Con fecha de publicación" },
  published: { label: "Publicada", hint: "Ya está online" },
  archived: { label: "Archivada", hint: "Descartada o pausada" },
};

export const PRIORITY_ORDER = ["low", "medium", "high"];
export const PRIORITY_META = {
  low: { label: "Baja", rank: 1 },
  medium: { label: "Media", rank: 2 },
  high: { label: "Alta", rank: 3 },
};

export const SORT_OPTIONS = [
  { value: "created-desc", label: "Más recientes" },
  { value: "created-asc", label: "Más antiguas" },
  { value: "date-asc", label: "Publicación más próxima" },
  { value: "date-desc", label: "Publicación más lejana" },
  { value: "priority-desc", label: "Prioridad alta primero" },
  { value: "priority-asc", label: "Prioridad baja primero" },
];

/** Etiqueta canónica: minúsculas, sin # ni comas, máx. 30 caracteres. */
export const normalizeTag = (tag) =>
  String(tag).replace(/[#,]/g, "").trim().toLowerCase().slice(0, 30);

/** Estados en los que una idea "sigue viva" en el calendario. */
export const isOpenStatus = (status) => status !== "published" && status !== "archived";

/** Valores por defecto de una idea nueva (formulario manual). */
export function emptyIdeaValues() {
  return {
    title: "",
    description: "",
    category: "",
    platform: PLATFORMS[0],
    contentType: CONTENT_TYPES[0],
    status: "idea",
    priority: "medium",
    tags: [],
    notes: "",
    favorite: false,
    publishDate: null,
    generated: null,
    source: null,
  };
}

/** Primera frase de la idea, recortada, para usarla como título editable. */
function titleFromText(text = "") {
  const first = text.trim().split(/(?<=[.!?])\s/)[0] ?? "";
  return first.length > 72 ? `${first.slice(0, 69).trimEnd()}…` : first;
}

/**
 * Convierte la respuesta cruda de Gemini (/generate) en valores de idea
 * listos para revisar. NO guarda nada: el usuario decide si guardarla.
 *
 * @param {{idea:string,hook:string,script:string,caption:string,hashtags:string[]}} result
 * @param {{company:string,sector:string,audience:string,platform:string,contentType:string}} params
 */
export function ideaValuesFromGeneration(result, params) {
  return {
    ...emptyIdeaValues(),
    title: titleFromText(result.idea),
    description: result.idea,
    category: params.sector,
    platform: params.platform,
    contentType: params.contentType,
    generated: {
      hook: result.hook ?? "",
      script: result.script ?? "",
      caption: result.caption ?? "",
      hashtags: Array.isArray(result.hashtags) ? result.hashtags : [],
    },
    source: {
      company: params.company,
      sector: params.sector,
      audience: params.audience,
    },
  };
}
