"""
Cliente de Gemini y construcción del prompt. Es el mismo código que ya
funcionaba en `backend/main.py` (mismo prompt, mismos modelos de reserva,
mismos reintentos); solo se ha movido de sitio y la comprobación de la API
key ahora es diferida (en la primera llamada) en vez de al arrancar la
aplicación, para que el resto de la API (ideas) funcione aunque todavía no
se haya configurado GEMINI_API_KEY.
"""
from __future__ import annotations

import json
import time
from functools import lru_cache

from fastapi import HTTPException
from openai import OpenAI

from .config import GEMINI_API_KEY, GEMINI_BASE_URL, GEMINI_MODELS
from .schemas import GenerateRequest

REQUIRED_FIELDS = ["idea", "hook", "script", "caption", "hashtags"]


@lru_cache(maxsize=1)
def get_client() -> OpenAI:
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="No se ha encontrado GEMINI_API_KEY. Comprueba que existe backend/.env y que contiene la API key.",
        )
    return OpenAI(api_key=GEMINI_API_KEY, base_url=GEMINI_BASE_URL)


def _clean_json_response(content: str) -> str:
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    return content.strip()


def _validate_result(result: dict) -> bool:
    if not all(field in result for field in REQUIRED_FIELDS):
        return False
    if not isinstance(result["hashtags"], list) or len(result["hashtags"]) != 5:
        return False
    return True


def _build_prompt(request: GenerateRequest) -> str:
    return f"""
Eres un experto en creación de contenido para redes sociales.

Tu trabajo es crear contenido atractivo y profesional para una empresa.

Datos de la empresa:

Empresa:
{request.company}

Sector:
{request.sector}

Público objetivo:
{request.audience}

Red social:
{request.platform}

Tipo de contenido:
{request.content_type}

Crea una propuesta de contenido específica para esta empresa,
adaptada a la red social y al público objetivo.

Debes devolver únicamente un JSON válido.

No escribas explicaciones antes ni después.

Utiliza exactamente esta estructura:

{{
    "idea": "Una idea concreta para el contenido",
    "hook": "Un hook atractivo para captar la atención",
    "script": "Un guion breve y estructurado",
    "caption": "El texto de la publicación",
    "hashtags": [
        "#hashtag1",
        "#hashtag2",
        "#hashtag3",
        "#hashtag4",
        "#hashtag5"
    ]
}}

Requisitos:

- El contenido debe ser natural.
- Debe resultar atractivo.
- Debe ser específico para la empresa.
- Debe estar adaptado a {request.platform}.
- Debe estar adaptado a {request.audience}.
- Evita ideas genéricas.
- El hook debe intentar captar la atención rápidamente.
- El guion debe ser práctico y fácil de utilizar.
- Los hashtags deben estar relacionados con el contenido.
- Utiliza exactamente 5 hashtags.
- No utilices Markdown.
- Devuelve únicamente el JSON.
"""


def generate_content(request: GenerateRequest) -> dict:
    client = get_client()
    prompt = _build_prompt(request)
    last_error: Exception | None = None

    for model in GEMINI_MODELS:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": prompt}],
                )
                content = response.choices[0].message.content
                if not content:
                    raise ValueError("Gemini ha devuelto una respuesta vacía.")

                content = _clean_json_response(content)
                try:
                    result = json.loads(content)
                except json.JSONDecodeError as json_error:
                    raise ValueError(f"JSON inválido: {json_error}") from json_error

                if not _validate_result(result):
                    raise ValueError("La respuesta de Gemini no contiene todos los campos necesarios.")

                return result
            except Exception as error:  # noqa: BLE001 - se reintenta con reserva de modelos
                last_error = error
                if attempt < max_retries - 1:
                    time.sleep(2**attempt)
        continue

    raise HTTPException(
        status_code=503,
        detail={
            "message": "El servicio de generación de IA no está disponible temporalmente.",
            "error": str(last_error) if last_error else "Error desconocido.",
        },
    )
