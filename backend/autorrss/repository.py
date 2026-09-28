"""CRUD de ideas contra SQLite. Trabaja con diccionarios en snake_case
(los mismos que produce/consume `domain.py`); la conversión camelCase vive
solo en `schemas.py`."""
from __future__ import annotations

from . import database

_COLUMNS = (
    "id, title, description, category, platform, content_type, status, priority, "
    "tags, notes, favorite, created_at, updated_at, publish_date, published_at, generated, source"
)
_PLACEHOLDERS = ", ".join(f":{name}" for name in _COLUMNS.replace(" ", "").split(","))


def list_ideas() -> list[dict]:
    with database.get_connection() as conn:
        rows = conn.execute(f"SELECT {_COLUMNS} FROM ideas ORDER BY created_at DESC").fetchall()
        return [database.row_to_record(row) for row in rows]


def get_idea(idea_id: str) -> dict | None:
    with database.get_connection() as conn:
        row = conn.execute(f"SELECT {_COLUMNS} FROM ideas WHERE id = ?", (idea_id,)).fetchone()
        return database.row_to_record(row) if row else None


def insert_idea(record: dict) -> None:
    with database.get_connection() as conn:
        conn.execute(f"INSERT INTO ideas ({_COLUMNS}) VALUES ({_PLACEHOLDERS})", database.record_to_columns(record))


def replace_idea(record: dict) -> None:
    columns = database.record_to_columns(record)
    assignments = ", ".join(f"{key} = :{key}" for key in columns if key != "id")
    with database.get_connection() as conn:
        conn.execute(f"UPDATE ideas SET {assignments} WHERE id = :id", columns)


def delete_idea(idea_id: str) -> bool:
    with database.get_connection() as conn:
        cursor = conn.execute("DELETE FROM ideas WHERE id = ?", (idea_id,))
        return cursor.rowcount > 0


def replace_all(records: list[dict]) -> None:
    """Sustituye toda la tabla (usado por los datos de demostración)."""
    with database.get_connection() as conn:
        conn.execute("DELETE FROM ideas")
        if records:
            conn.executemany(
                f"INSERT INTO ideas ({_COLUMNS}) VALUES ({_PLACEHOLDERS})",
                [database.record_to_columns(record) for record in records],
            )


def count() -> int:
    with database.get_connection() as conn:
        return conn.execute("SELECT COUNT(*) FROM ideas").fetchone()[0]
