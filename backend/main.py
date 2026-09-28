from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from autorrss import ideas_service
from autorrss.config import CORS_ORIGINS
from autorrss.database import init_db
from autorrss.errors import DomainError, domain_error_handler
from autorrss.routers import generate, ideas

app = FastAPI(
    title="AutoRRSS API",
    description="API de gestión de ideas de contenido y generación con IA para redes sociales.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(DomainError, domain_error_handler)

app.include_router(ideas.router)
app.include_router(generate.router)


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    ideas_service.seed_if_empty()


@app.get("/")
def root():
    return {"message": "AutoRRSS API funcionando", "status": "online"}
