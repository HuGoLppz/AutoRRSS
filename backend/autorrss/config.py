"""Configuración de la aplicación, leída de variables de entorno (.env)."""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BACKEND_DIR = Path(__file__).resolve().parent.parent

# --- Base de datos --------------------------------------------------------
DATABASE_PATH = os.getenv("DATABASE_PATH", str(BACKEND_DIR / "data" / "autorrss.db"))

# --- CORS ------------------------------------------------------------------
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin.strip()
]

# --- Gemini (generación de contenido) --------------------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"
GEMINI_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
]
