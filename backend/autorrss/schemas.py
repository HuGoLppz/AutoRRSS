"""
Esquemas Pydantic. Internamente se usa snake_case (estilo Python); hacia
fuera se serializan en camelCase mediante `alias_generator`, para que el
JSON coincida exactamente con el modelo del frontend
(`frontend/src/models/idea.js`) sin tener que traducir campo a campo.
"""
from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

STATUSES = Literal["idea", "preparing", "scheduled", "published", "archived"]
PRIORITIES = Literal["low", "medium", "high"]


def _to_camel(field: str) -> str:
    head, *rest = field.split("_")
    return head + "".join(part.title() for part in rest)


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=_to_camel, populate_by_name=True)


class GeneratedContent(CamelModel):
    hook: str = ""
    script: str = ""
    caption: str = ""
    hashtags: list[str] = Field(default_factory=list)


class GenerationSource(CamelModel):
    company: str = ""
    sector: str = ""
    audience: str = ""


class IdeaOut(CamelModel):
    """Idea tal y como la consume el frontend."""

    id: str
    title: str
    description: str = ""
    category: str = ""
    platform: str
    content_type: str
    status: STATUSES
    priority: PRIORITIES
    tags: list[str] = Field(default_factory=list)
    notes: str = ""
    favorite: bool = False
    created_at: str
    updated_at: str
    publish_date: Optional[str] = None
    published_at: Optional[str] = None
    generated: Optional[GeneratedContent] = None
    source: Optional[GenerationSource] = None


class IdeaCreate(CamelModel):
    """Cuerpo de POST /ideas. Todo opcional salvo el título: los mismos
    valores por defecto que `emptyIdeaValues()` en el frontend."""

    title: str
    description: str = ""
    category: str = ""
    platform: str = "TikTok"
    content_type: str = "Vídeo corto"
    status: STATUSES = "idea"
    priority: PRIORITIES = "medium"
    tags: list[str] = Field(default_factory=list)
    notes: str = ""
    favorite: bool = False
    publish_date: Optional[str] = None
    generated: Optional[GeneratedContent] = None
    source: Optional[GenerationSource] = None


class IdeaUpdate(CamelModel):
    """Cuerpo de PATCH /ideas/{id}. Todos los campos opcionales: solo se
    aplican los que se envíen (`exclude_unset`)."""

    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    platform: Optional[str] = None
    content_type: Optional[str] = None
    status: Optional[STATUSES] = None
    priority: Optional[PRIORITIES] = None
    tags: Optional[list[str]] = None
    notes: Optional[str] = None
    favorite: Optional[bool] = None
    publish_date: Optional[str] = None
    generated: Optional[GeneratedContent] = None
    source: Optional[GenerationSource] = None


class ScheduleRequest(CamelModel):
    publish_date: str


class StatusRequest(CamelModel):
    status: STATUSES


class GenerateRequest(CamelModel):
    company: str
    sector: str
    audience: str
    platform: str
    content_type: str

    @field_validator("company", "sector", "audience", "platform", "content_type")
    @classmethod
    def not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Este campo no puede estar vacío.")
        return value


class GenerateResult(BaseModel):
    idea: str
    hook: str
    script: str
    caption: str
    hashtags: list[str]
