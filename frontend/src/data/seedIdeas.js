import { addDays, todayISO } from "../utils/dates";

const company = {
  company: "Pulso Gym",
  sector: "Fitness",
  audience: "Jóvenes de 18 a 30 años",
};

export function buildSeedIdeas() {
  const today = todayISO();
  const created = (daysAgo, hour = 10) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, 15, 0, 0);
    return d.toISOString();
  };
  const at = (offset) => addDays(today, offset);

  const make = (n, o) => ({
    id: `seed-${String(n).padStart(2, "0")}`,
    contentType: "Vídeo corto",
    priority: "medium",
    tags: [],
    notes: "",
    favorite: false,
    publishDate: null,
    publishedAt: null,
    generated: null,
    source: null,
    updatedAt: o.createdAt,
    ...o,
  });

  return [
    make(1, {
      title: "Rutina de 10 minutos para quienes no tienen tiempo",
      description:
        "Vídeo corto mostrando una rutina de cuerpo completo sin material que se puede hacer antes de ir a trabajar.",
      category: "Fitness",
      platform: "TikTok",
      status: "scheduled",
      priority: "high",
      tags: ["ia", "rutinas", "principiantes"],
      favorite: true,
      createdAt: created(21),
      publishDate: at(0),
      notes:
        "Grabar con luz natural. Cerrar con la llamada a probar la clase gratis.",
      generated: {
        hook: "¿Crees que no tienes 10 minutos? Mira esto.",
        script:
          "0-3s: hook a cámara.\n3-25s: cuatro ejercicios de 30 s.\n25-30s: resumen y llamada a la acción.",
        caption:
          "10 minutos. Cero excusas. Guárdalo para mañana por la mañana.",
        hashtags: [
          "#rutina10min",
          "#fitness",
          "#sinexcusas",
          "#entrenaencasa",
          "#pulsogym",
        ],
      },
      source: company,
    }),
    make(2, {
      title: "Cómo usamos IA para personalizar tu plan de entreno",
      description:
        "Explicamos con pantalla grabada cómo la app de Pulso adapta las series según el progreso de cada socio.",
      category: "Producto",
      platform: "TikTok",
      status: "scheduled",
      priority: "high",
      tags: ["ia", "app", "producto"],
      favorite: true,
      createdAt: created(18),
      publishDate: at(2),
      generated: {
        hook: "Tu entrenador ahora también es un algoritmo.",
        script:
          "Mostrar la app, comparar dos semanas de entrenos y enseñar el ajuste automático de cargas.",
        caption: "Menos improvisar, más progresar. Descubre cómo funciona.",
        hashtags: [
          "#ia",
          "#fitnessapp",
          "#tecnologia",
          "#entrenamiento",
          "#pulsogym",
        ],
      },
      source: company,
    }),
    make(3, {
      title: "Tres errores al empezar en el gimnasio",
      description:
        "Carrusel con los errores más comunes de quien acaba de apuntarse y cómo evitarlos.",
      category: "Fitness",
      platform: "Instagram",
      contentType: "Publicación",
      status: "scheduled",
      tags: ["principiantes", "consejos"],
      createdAt: created(16),
      publishDate: at(3),
    }),
    make(4, {
      title: "Mito o verdad: entrenar en ayunas quema más grasa",
      description:
        "Vídeo corto con el entrenador jefe desmontando el mito con datos.",
      category: "Nutrición",
      platform: "YouTube",
      status: "scheduled",
      priority: "low",
      tags: ["mitos", "nutricion"],
      createdAt: created(14),
      publishDate: at(6),
    }),
    make(5, {
      title: "Una semana de menú en 15 minutos",
      description:
        "Guía de meal prep con lista de la compra descargable para captar leads.",
      category: "Nutrición",
      platform: "Instagram",
      contentType: "Publicación",
      status: "scheduled",
      tags: ["meal-prep", "nutricion"],
      favorite: true,
      createdAt: created(11),
      publishDate: at(12),
    }),
    make(6, {
      title: "Reto de 30 días: así llegan los socios a la meta",
      description:
        "Serie en tres partes con testimonios reales de socios que completaron el reto.",
      category: "Comunidad",
      platform: "Instagram",
      contentType: "Historia",
      status: "preparing",
      priority: "high",
      tags: ["reto", "comunidad"],
      createdAt: created(13),
      publishDate: at(5),
      notes: "Pedir permiso por escrito a los tres socios antes de publicar.",
    }),
    make(7, {
      title: "Día en la vida de un entrenador de Pulso",
      description:
        "Vlog de un día completo: apertura, clases, atención a socios y cierre.",
      category: "Comunidad",
      platform: "YouTube",
      status: "preparing",
      priority: "medium",
      tags: ["vlog", "equipo"],
      createdAt: created(9),
      publishDate: at(-2),
    }),
    make(8, {
      title: "Cinco herramientas de IA para planificar tus entrenos",
      description:
        "Lista comparativa de herramientas para LinkedIn dirigida a profesionales del fitness.",
      category: "Marketing",
      platform: "LinkedIn",
      contentType: "Artículo",
      status: "preparing",
      tags: ["ia", "herramientas", "b2b"],
      createdAt: created(7),
    }),
    make(9, {
      title: "Ideas de contenido para enero: el mes de los propósitos",
      description:
        "Lluvia de ideas para la campaña de captación de enero con el gancho de los propósitos.",
      category: "Marketing",
      platform: "Instagram",
      contentType: "Publicación",
      status: "idea",
      priority: "high",
      tags: ["campaña", "captacion"],
      favorite: true,
      createdAt: created(5),
    }),
    make(10, {
      title: "Reacción a mitos de gym de TikTok con el entrenador",
      description:
        "El entrenador reacciona a vídeos virales de fitness y puntúa si son verdad o mentira.",
      category: "Fitness",
      platform: "TikTok",
      status: "idea",
      priority: "medium",
      tags: ["mitos", "tendencia"],
      createdAt: created(4),
    }),
    make(11, {
      title: "Cómo construir una rutina con IA en dos minutos",
      description:
        "Tutorial en pantalla: pedirle a la IA una rutina, validarla con un entrenador y guardarla en la app.",
      category: "Producto",
      platform: "TikTok",
      status: "idea",
      priority: "medium",
      tags: ["ia", "tutorial"],
      createdAt: created(3),
    }),
    make(12, {
      title: "Presentar la nueva zona de peso libre",
      description: "Recorrido en vídeo por la reforma con antes y después.",
      category: "Producto",
      platform: "YouTube",
      status: "idea",
      priority: "low",
      tags: ["novedades"],
      createdAt: created(2),
    }),
    make(13, {
      title: "Artículo: la ciencia detrás del descanso entre series",
      description:
        "Artículo de autoridad sobre tiempos de descanso, con referencias y consejos aplicables.",
      category: "Fitness",
      platform: "LinkedIn",
      contentType: "Artículo",
      status: "idea",
      priority: "low",
      tags: ["ciencia", "b2b"],
      createdAt: created(1),
    }),
    make(14, {
      title: "Antes y después: seis semanas con entrenamiento guiado",
      description:
        "Transformación de un socio con su permiso, centrada en hábitos y no en estética.",
      category: "Comunidad",
      platform: "Instagram",
      contentType: "Publicación",
      status: "published",
      priority: "high",
      tags: ["transformacion", "comunidad"],
      favorite: true,
      createdAt: created(30),
      publishDate: at(-3),
      publishedAt: created(3, 18),
    }),
    make(15, {
      title: "Calentamiento de cinco minutos que evita lesiones",
      description:
        "Vídeo corto con cinco movimientos de movilidad antes de entrenar.",
      category: "Fitness",
      platform: "TikTok",
      status: "published",
      priority: "medium",
      tags: ["rutinas", "lesiones"],
      createdAt: created(26),
      publishDate: at(-8),
      publishedAt: created(8, 19),
    }),
    make(16, {
      title: "Sorteo de una mensualidad por seguirnos",
      description:
        "Publicación de sorteo con normas claras y mención de la cuenta.",
      category: "Marketing",
      platform: "Instagram",
      contentType: "Publicación",
      status: "archived",
      priority: "low",
      tags: ["sorteo"],
      createdAt: created(28),
      notes:
        "Descartada: el sorteo no encaja con la línea de comunicación actual.",
    }),
  ];
}
