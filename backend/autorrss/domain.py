"""
Reglas de negocio de una idea. Funciones puras sobre diccionarios (sin tocar
la base de datos ni HTTP), para que se puedan probar de forma aislada.

Es el equivalente en Python de la lógica que ya vive en el frontend
(`frontend/src/services/ideasService.js` y `frontend/src/models/idea.js`):
mismos estados, misma normalización de etiquetas y mismas transiciones.
Debe mantenerse igual en ambos sitios si algún día se decide validar en
los dos lados.
"""
from __future__ import annotations

import re
from datetime import date, datetime, timezone
from typing import Any
from uuid import uuid4

from .errors import DomainError

STATUS_ORDER = ["idea", "preparing", "scheduled", "published", "archived"]
PRIORITY_ORDER = ["low", "medium", "high"]

# Campos que se pueden crear/editar desde el cliente.
EDITABLE_FIELDS = [
    "title", "description", "category", "platform", "content_type", "status",
    "priority", "tags", "notes", "favorite", "publish_date", "generated", "source",
]

_ISO_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
_TAG_CHARS_RE = re.compile(r"[#,]")


def now_iso() -> str:
    """Instante actual en ISO 8601 UTC, formato `...Z` (igual que Date#toISOString en JS)."""
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def today_iso() -> str:
    return date.today().isoformat()


def new_id() -> str:
    return str(uuid4())


def is_iso_date(value: Any) -> bool:
    if not isinstance(value, str) or not _ISO_DATE_RE.match(value):
        return False
    try:
        date.fromisoformat(value)
        return True
    except ValueError:
        return False


def normalize_tag(tag: str) -> str:
    return _TAG_CHARS_RE.sub("", str(tag)).strip().lower()[:30]


def normalize_tags(tags: list[str]) -> list[str]:
    seen: list[str] = []
    for tag in tags or []:
        normalized = normalize_tag(tag)
        if normalized and normalized not in seen:
            seen.append(normalized)
    return seen


def empty_idea_fields() -> dict:
    """Valores por defecto de una idea nueva (equivalente a emptyIdeaValues() en JS)."""
    return {
        "title": "", "description": "", "category": "",
        "platform": "TikTok", "content_type": "Vídeo corto",
        "status": "idea", "priority": "medium",
        "tags": [], "notes": "", "favorite": False,
        "publish_date": None, "generated": None, "source": None,
    }


def _pick_editable(data: dict) -> dict:
    return {key: data[key] for key in EDITABLE_FIELDS if key in data}


def _validate(fields: dict) -> None:
    if "title" in fields and not str(fields["title"]).strip():
        raise DomainError("El título es obligatorio.", "invalid")
    if "status" in fields and fields["status"] not in STATUS_ORDER:
        raise DomainError("Estado no válido.", "invalid")
    if "priority" in fields and fields["priority"] not in PRIORITY_ORDER:
        raise DomainError("Prioridad no válida.", "invalid")
    if "publish_date" in fields and fields["publish_date"] is not None and not is_iso_date(fields["publish_date"]):
        raise DomainError("La fecha debe tener el formato AAAA-MM-DD.", "invalid")


def _clean(fields: dict) -> dict:
    out = dict(fields)
    for key in ("title", "description", "category", "notes"):
        if key in out:
            out[key] = str(out[key] or "").strip()
    if "tags" in out:
        out["tags"] = normalize_tags(out["tags"])
    if "publish_date" in out and not out["publish_date"]:
        out["publish_date"] = None
    return out


def _with_status(record: dict, status: str) -> dict:
    """Efectos secundarios de cambiar de estado (fechas de publicación)."""
    if record["status"] == status:
        return record
    next_record = {**record, "status": status}
    if status == "published":
        next_record["published_at"] = now_iso()
        if not next_record.get("publish_date"):
            next_record["publish_date"] = today_iso()
    else:
        next_record["published_at"] = None
    return next_record


def apply_patch(record: dict, patch: dict, now: str | None = None) -> dict:
    """Aplica un cambio parcial validado a una idea existente."""
    fields = _clean(_pick_editable(patch))
    _validate(fields)
    status = fields.pop("status", None)
    next_record = {**record, **fields}
    if status is not None:
        next_record = _with_status(next_record, status)
    next_record["updated_at"] = now or now_iso()
    return next_record


def build_new_idea(data: dict) -> dict:
    """Construye una idea nueva a partir de los campos editables recibidos."""
    fields = _clean(_pick_editable({**empty_idea_fields(), **data}))
    _validate(fields)
    now = now_iso()
    status = fields.pop("status", "idea")
    base = {
        **fields,
        "id": new_id(),
        "status": "idea",
        "created_at": now,
        "updated_at": now,
        "published_at": None,
    }
    return _with_status(base, status)


def schedule(record: dict, publish_date: str) -> dict:
    """Programa (o reprograma) una idea. No toca el estado si ya tenía fecha."""
    if not is_iso_date(publish_date):
        raise DomainError("Elige una fecha válida.", "invalid")
    keep_status = (
        record["status"] in ("scheduled", "published")
        or (bool(record.get("publish_date")) and record["status"] != "archived")
    )
    patch = {"publish_date": publish_date}
    if not keep_status:
        patch["status"] = "scheduled"
    return apply_patch(record, patch)


def unschedule(record: dict) -> dict:
    """Cancela la programación. Una idea Programada vuelve a En preparación."""
    patch: dict = {"publish_date": None}
    if record["status"] == "scheduled":
        patch["status"] = "preparing"
    return apply_patch(record, patch)


def toggle_favorite(record: dict) -> dict:
    return apply_patch(record, {"favorite": not record["favorite"]})
