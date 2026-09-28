/**
 * generationService — comunicación con el backend Python (Gemini).
 *
 * `requestIdea` es la llamada ORIGINAL de la aplicación (POST /generate),
 * movida aquí sin cambios de contrato: mismo endpoint, mismos campos y misma
 * respuesta {idea, hook, script, caption, hashtags}.
 *
 * ⚠️ El backend actual solo genera UNA idea por petición. Para ofrecer
 * 1/3/5/10 ideas, `generateIdeas` repite esa misma petición (con un límite de
 * concurrencia) y descarta duplicados exactos. Cuando el backend admita
 * `count`, basta con reescribir `generateIdeas` para hacer UNA sola petición
 * (p. ej. POST /generate {…, count}); la interfaz no cambia.
 */
import { API_BASE_URL, GENERATION_CONCURRENCY } from "../config";

export class GenerationError extends Error {
  constructor(message) {
    super(message);
    this.name = "GenerationError";
  }
}

/**
 * @param {{company:string,sector:string,audience:string,platform:string,contentType:string}} params
 * @returns {Promise<{idea:string,hook:string,script:string,caption:string,hashtags:string[]}>}
 */
export async function requestIdea(params) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  } catch {
    throw new GenerationError("No se ha podido conectar con el servidor.");
  }

  if (!response.ok) {
    throw new GenerationError(
      response.status === 503
        ? "El servicio de generación no está disponible temporalmente. Inténtalo de nuevo en unos minutos."
        : "Error al comunicarse con el servidor.",
    );
  }

  const data = await response.json();
  if (!data || typeof data.idea !== "string") {
    throw new GenerationError("El servidor ha devuelto una respuesta inesperada.");
  }
  return data;
}

/** Ejecuta `tasks` (funciones que devuelven promesas) con un máximo de `limit` a la vez. */
async function runLimited(tasks, limit) {
  const results = new Array(tasks.length);
  let next = 0;
  const worker = async () => {
    while (next < tasks.length) {
      const i = next++;
      try {
        results[i] = { ok: true, value: await tasks[i]() };
      } catch (error) {
        results[i] = { ok: false, error };
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}

const normalize = (text) => text.toLowerCase().replace(/\s+/g, " ").trim();

/**
 * Genera `count` ideas. Devuelve las que se hayan podido generar y cuántas
 * fallaron, para poder mostrar resultados parciales.
 *
 * @returns {Promise<{results: Array<Awaited<ReturnType<typeof requestIdea>>>, failed: number, firstError: string|null}>}
 */
export async function generateIdeas(params, count = 1) {
  const tasks = Array.from({ length: count }, () => () => requestIdea(params));
  const settled = await runLimited(tasks, GENERATION_CONCURRENCY);

  const seen = new Set();
  const results = [];
  let failed = 0;
  let firstError = null;

  for (const item of settled) {
    if (!item.ok) {
      failed += 1;
      firstError ??= item.error?.message ?? "Error desconocido.";
      continue;
    }
    const key = normalize(item.value.idea);
    if (seen.has(key)) continue; // duplicado exacto
    seen.add(key);
    results.push(item.value);
  }

  if (results.length === 0) {
    throw new GenerationError(firstError ?? "No se ha podido generar ninguna idea.");
  }
  return { results, failed, firstError };
}
