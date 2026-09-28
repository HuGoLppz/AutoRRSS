"""Orquesta `domain` (reglas) y `repository` (persistencia). Es lo que
importan los routers; ninguna otra capa toca `repository` directamente."""
from __future__ import annotations

from . import domain, repository
from .errors import DomainError
from .seed import build_seed_ideas


def list_ideas() -> list[dict]:
    return repository.list_ideas()


def get_idea(idea_id: str) -> dict:
    record = repository.get_idea(idea_id)
    if record is None:
        raise DomainError("No se ha encontrado la idea.", "not_found")
    return record


def create_idea(data: dict) -> dict:
    record = domain.build_new_idea(data)
    repository.insert_idea(record)
    return record


def update_idea(idea_id: str, patch: dict) -> dict:
    record = get_idea(idea_id)
    updated = domain.apply_patch(record, patch)
    repository.replace_idea(updated)
    return updated


def delete_idea(idea_id: str) -> str:
    get_idea(idea_id)  # 404 si no existe
    repository.delete_idea(idea_id)
    return idea_id


def set_status(idea_id: str, status: str) -> dict:
    return update_idea(idea_id, {"status": status})


def toggle_favorite(idea_id: str) -> dict:
    record = get_idea(idea_id)
    updated = domain.toggle_favorite(record)
    repository.replace_idea(updated)
    return updated


def schedule_idea(idea_id: str, publish_date: str) -> dict:
    record = get_idea(idea_id)
    updated = domain.schedule(record, publish_date)
    repository.replace_idea(updated)
    return updated


def unschedule_idea(idea_id: str) -> dict:
    record = get_idea(idea_id)
    updated = domain.unschedule(record)
    repository.replace_idea(updated)
    return updated


def reset_demo_data() -> list[dict]:
    seed = build_seed_ideas()
    repository.replace_all(seed)
    return seed


def clear_all_ideas() -> list[dict]:
    repository.replace_all([])
    return []


def seed_if_empty() -> None:
    """Se llama al arrancar: si la tabla está vacía, se rellena con datos de ejemplo."""
    if repository.count() == 0:
        repository.replace_all(build_seed_ideas())
