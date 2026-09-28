"""
Endpoints de ideas. Reglas HTTP ↔ dominio:
  GET    /ideas                     -> ideas_service.list_ideas
  GET    /ideas/{id}                -> ideas_service.get_idea
  POST   /ideas                     -> ideas_service.create_idea
  PATCH  /ideas/{id}                -> ideas_service.update_idea
  DELETE /ideas/{id}                -> ideas_service.delete_idea
  POST   /ideas/{id}/schedule       -> ideas_service.schedule_idea
  DELETE /ideas/{id}/schedule       -> ideas_service.unschedule_idea
  POST   /ideas/{id}/status         -> ideas_service.set_status
  POST   /ideas/{id}/favorite       -> ideas_service.toggle_favorite
  POST   /ideas/demo/reset          -> ideas_service.reset_demo_data  (extensión: datos de ejemplo)
  DELETE /ideas                     -> ideas_service.clear_all_ideas (extensión: vaciar biblioteca)

Los endpoints son `def` (no `async def`) porque sqlite3 es bloqueante;
FastAPI los ejecuta automáticamente en un pool de hilos.
"""
from fastapi import APIRouter, status

from .. import ideas_service
from ..schemas import IdeaCreate, IdeaOut, IdeaUpdate, ScheduleRequest, StatusRequest

router = APIRouter(prefix="/ideas", tags=["ideas"])


@router.get("", response_model=list[IdeaOut])
def list_ideas():
    return ideas_service.list_ideas()


@router.post("/demo/reset", response_model=list[IdeaOut])
def reset_demo_data():
    """Sustituye todas las ideas por los datos de ejemplo."""
    return ideas_service.reset_demo_data()


@router.delete("", response_model=list[IdeaOut])
def clear_all_ideas():
    """Elimina todas las ideas (para probar los estados vacíos)."""
    return ideas_service.clear_all_ideas()


@router.get("/{idea_id}", response_model=IdeaOut)
def get_idea(idea_id: str):
    return ideas_service.get_idea(idea_id)


@router.post("", response_model=IdeaOut, status_code=status.HTTP_201_CREATED)
def create_idea(payload: IdeaCreate):
    return ideas_service.create_idea(payload.model_dump())


@router.patch("/{idea_id}", response_model=IdeaOut)
def update_idea(idea_id: str, payload: IdeaUpdate):
    return ideas_service.update_idea(idea_id, payload.model_dump(exclude_unset=True))


@router.delete("/{idea_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_idea(idea_id: str):
    ideas_service.delete_idea(idea_id)


@router.post("/{idea_id}/schedule", response_model=IdeaOut)
def schedule_idea(idea_id: str, payload: ScheduleRequest):
    return ideas_service.schedule_idea(idea_id, payload.publish_date)


@router.delete("/{idea_id}/schedule", response_model=IdeaOut)
def unschedule_idea(idea_id: str):
    return ideas_service.unschedule_idea(idea_id)


@router.post("/{idea_id}/status", response_model=IdeaOut)
def set_status(idea_id: str, payload: StatusRequest):
    return ideas_service.set_status(idea_id, payload.status)


@router.post("/{idea_id}/favorite", response_model=IdeaOut)
def toggle_favorite(idea_id: str):
    return ideas_service.toggle_favorite(idea_id)
