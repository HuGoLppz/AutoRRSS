"""
Datos de demostración (16 ideas), traducidos 1:1 desde
`frontend/src/data/seedIdeas.js` para que el backend arranque con el mismo
contenido de ejemplo que tenía la fase solo-frontend. Las fechas son
relativas a "hoy" para que el dashboard y el calendario siempre tengan
contenido cercano.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from .domain import today_iso

_COMPANY = {"company": "Pulso Gym", "sector": "Fitness", "audience": "Jóvenes de 18 a 30 años"}


def _created(days_ago: int, hour: int = 10) -> str:
    dt = datetime.now(timezone.utc) - timedelta(days=days_ago)
    dt = dt.replace(hour=hour, minute=15, second=0, microsecond=0)
    return dt.isoformat(timespec="milliseconds").replace("+00:00", "Z")


def _at(offset: int, today: str) -> str:
    d = datetime.fromisoformat(today) + timedelta(days=offset)
    return d.date().isoformat()


def build_seed_ideas() -> list[dict]:
    today = today_iso()

    def make(n: int, **overrides) -> dict:
        created_at = overrides.get("created_at", _created(0))
        base = {
            "id": f"seed-{n:02d}",
            "content_type": "Vídeo corto",
            "priority": "medium",
            "tags": [],
            "notes": "",
            "favorite": False,
            "publish_date": None,
            "published_at": None,
            "generated": None,
            "source": None,
            "updated_at": created_at,
        }
        return {**base, **overrides, "created_at": created_at}

    return [
        make(1, title="Rutina de 10 minutos para quienes no tienen tiempo",
             description="Vídeo corto mostrando una rutina de cuerpo completo sin material que se puede hacer antes de ir a trabajar.",
             category="Fitness", platform="TikTok", status="scheduled", priority="high",
             tags=["ia", "rutinas", "principiantes"], favorite=True,
             created_at=_created(21), publish_date=_at(0, today),
             notes="Grabar con luz natural. Cerrar con la llamada a probar la clase gratis.",
             generated={
                 "hook": "¿Crees que no tienes 10 minutos? Mira esto.",
                 "script": "0-3s: hook a cámara.\n3-25s: cuatro ejercicios de 30 s.\n25-30s: resumen y llamada a la acción.",
                 "caption": "10 minutos. Cero excusas. Guárdalo para mañana por la mañana.",
                 "hashtags": ["#rutina10min", "#fitness", "#sinexcusas", "#entrenaencasa", "#pulsogym"],
             }, source=_COMPANY),
        make(2, title="Cómo usamos IA para personalizar tu plan de entreno",
             description="Explicamos con pantalla grabada cómo la app de Pulso adapta las series según el progreso de cada socio.",
             category="Producto", platform="TikTok", status="scheduled", priority="high",
             tags=["ia", "app", "producto"], favorite=True,
             created_at=_created(18), publish_date=_at(2, today),
             generated={
                 "hook": "Tu entrenador ahora también es un algoritmo.",
                 "script": "Mostrar la app, comparar dos semanas de entrenos y enseñar el ajuste automático de cargas.",
                 "caption": "Menos improvisar, más progresar. Descubre cómo funciona.",
                 "hashtags": ["#ia", "#fitnessapp", "#tecnologia", "#entrenamiento", "#pulsogym"],
             }, source=_COMPANY),
        make(3, title="Tres errores al empezar en el gimnasio",
             description="Carrusel con los errores más comunes de quien acaba de apuntarse y cómo evitarlos.",
             category="Fitness", platform="Instagram", content_type="Publicación", status="scheduled",
             tags=["principiantes", "consejos"], created_at=_created(16), publish_date=_at(3, today)),
        make(4, title="Mito o verdad: entrenar en ayunas quema más grasa",
             description="Vídeo corto con el entrenador jefe desmontando el mito con datos.",
             category="Nutrición", platform="YouTube", status="scheduled", priority="low",
             tags=["mitos", "nutricion"], created_at=_created(14), publish_date=_at(6, today)),
        make(5, title="Una semana de menú en 15 minutos",
             description="Guía de meal prep con lista de la compra descargable para captar leads.",
             category="Nutrición", platform="Instagram", content_type="Publicación", status="scheduled",
             tags=["meal-prep", "nutricion"], favorite=True, created_at=_created(11), publish_date=_at(12, today)),
        make(6, title="Reto de 30 días: así llegan los socios a la meta",
             description="Serie en tres partes con testimonios reales de socios que completaron el reto.",
             category="Comunidad", platform="Instagram", content_type="Historia", status="preparing", priority="high",
             tags=["reto", "comunidad"], created_at=_created(13), publish_date=_at(5, today),
             notes="Pedir permiso por escrito a los tres socios antes de publicar."),
        make(7, title="Día en la vida de un entrenador de Pulso",
             description="Vlog de un día completo: apertura, clases, atención a socios y cierre.",
             category="Comunidad", platform="YouTube", status="preparing", priority="medium",
             tags=["vlog", "equipo"], created_at=_created(9), publish_date=_at(-2, today)),
        make(8, title="Cinco herramientas de IA para planificar tus entrenos",
             description="Lista comparativa de herramientas para LinkedIn dirigida a profesionales del fitness.",
             category="Marketing", platform="LinkedIn", content_type="Artículo", status="preparing",
             tags=["ia", "herramientas", "b2b"], created_at=_created(7)),
        make(9, title="Ideas de contenido para enero: el mes de los propósitos",
             description="Lluvia de ideas para la campaña de captación de enero con el gancho de los propósitos.",
             category="Marketing", platform="Instagram", content_type="Publicación", status="idea", priority="high",
             tags=["campaña", "captacion"], favorite=True, created_at=_created(5)),
        make(10, title="Reacción a mitos de gym de TikTok con el entrenador",
             description="El entrenador reacciona a vídeos virales de fitness y puntúa si son verdad o mentira.",
             category="Fitness", platform="TikTok", status="idea", priority="medium",
             tags=["mitos", "tendencia"], created_at=_created(4)),
        make(11, title="Cómo construir una rutina con IA en dos minutos",
             description="Tutorial en pantalla: pedirle a la IA una rutina, validarla con un entrenador y guardarla en la app.",
             category="Producto", platform="TikTok", status="idea", priority="medium",
             tags=["ia", "tutorial"], created_at=_created(3)),
        make(12, title="Presentar la nueva zona de peso libre",
             description="Recorrido en vídeo por la reforma con antes y después.",
             category="Producto", platform="YouTube", status="idea", priority="low",
             tags=["novedades"], created_at=_created(2)),
        make(13, title="Artículo: la ciencia detrás del descanso entre series",
             description="Artículo de autoridad sobre tiempos de descanso, con referencias y consejos aplicables.",
             category="Fitness", platform="LinkedIn", content_type="Artículo", status="idea", priority="low",
             tags=["ciencia", "b2b"], created_at=_created(1)),
        make(14, title="Antes y después: seis semanas con entrenamiento guiado",
             description="Transformación de un socio con su permiso, centrada en hábitos y no en estética.",
             category="Comunidad", platform="Instagram", content_type="Publicación", status="published", priority="high",
             tags=["transformacion", "comunidad"], favorite=True,
             created_at=_created(30), publish_date=_at(-3, today), published_at=_created(3, 18)),
        make(15, title="Calentamiento de cinco minutos que evita lesiones",
             description="Vídeo corto con cinco movimientos de movilidad antes de entrenar.",
             category="Fitness", platform="TikTok", status="published", priority="medium",
             tags=["rutinas", "lesiones"], created_at=_created(26), publish_date=_at(-8, today), published_at=_created(8, 19)),
        make(16, title="Sorteo de una mensualidad por seguirnos",
             description="Publicación de sorteo con normas claras y mención de la cuenta.",
             category="Marketing", platform="Instagram", content_type="Publicación", status="archived", priority="low",
             tags=["sorteo"], created_at=_created(28),
             notes="Descartada: el sorteo no encaja con la línea de comunicación actual."),
    ]
