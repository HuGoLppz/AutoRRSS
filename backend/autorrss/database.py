"""
Acceso a SQLite. Es la única capa que sabe que los datos viven en un
archivo `.db`; el resto de la aplicación trabaja con diccionarios en
snake_case (ver `repository.py`).

Se abre una conexión nueva y corta por operación en vez de mantener una
conexión global: es más simple y evita problemas de hilos, ya que FastAPI
ejecuta los endpoints síncronos en un pool de hilos.
"""
import json
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

from .config import DATABASE_PATH

SCHEMA = """
CREATE TABLE IF NOT EXISTS ideas (
    id           TEXT PRIMARY KEY,
    title        TEXT NOT NULL,
    description  TEXT NOT NULL DEFAULT '',
    category     TEXT NOT NULL DEFAULT '',
    platform     TEXT NOT NULL,
    content_type TEXT NOT NULL,
    status       TEXT NOT NULL,
    priority     TEXT NOT NULL,
    tags         TEXT NOT NULL DEFAULT '[]',
    notes        TEXT NOT NULL DEFAULT '',
    favorite     INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT NOT NULL,
    updated_at   TEXT NOT NULL,
    publish_date TEXT,
    published_at TEXT,
    generated    TEXT,
    source       TEXT
);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_publish_date ON ideas(publish_date);
"""


@contextmanager
def get_connection() -> Iterator[sqlite3.Connection]:
    Path(DATABASE_PATH).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DATABASE_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db() -> None:
    with get_connection() as conn:
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.executescript(SCHEMA)


# ---------------------------- (de)serialización ----------------------------
# Las columnas tags/generated/source se guardan como JSON en texto; aquí se
# convierten a/desde los tipos nativos que usa el resto de la aplicación.

def row_to_record(row: sqlite3.Row) -> dict:
    data = dict(row)
    data["tags"] = json.loads(data["tags"] or "[]")
    data["favorite"] = bool(data["favorite"])
    data["generated"] = json.loads(data["generated"]) if data["generated"] else None
    data["source"] = json.loads(data["source"]) if data["source"] else None
    return data


def record_to_columns(record: dict) -> dict:
    return {
        "id": record["id"],
        "title": record["title"],
        "description": record.get("description", ""),
        "category": record.get("category", ""),
        "platform": record["platform"],
        "content_type": record["content_type"],
        "status": record["status"],
        "priority": record["priority"],
        "tags": json.dumps(record.get("tags", [])),
        "notes": record.get("notes", ""),
        "favorite": int(bool(record.get("favorite"))),
        "created_at": record["created_at"],
        "updated_at": record["updated_at"],
        "publish_date": record.get("publish_date"),
        "published_at": record.get("published_at"),
        "generated": json.dumps(record["generated"]) if record.get("generated") else None,
        "source": json.dumps(record["source"]) if record.get("source") else None,
    }
