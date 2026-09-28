"""Errores de dominio y su traducción a respuestas HTTP."""
from fastapi import Request
from fastapi.responses import JSONResponse


class DomainError(Exception):
    """Error de una regla de negocio (no relacionado con el formato HTTP).

    `code` distingue los casos que la interfaz necesita tratar de forma
    distinta: "not_found" (404) frente a cualquier otro (400).
    """

    def __init__(self, message: str, code: str = "invalid"):
        super().__init__(message)
        self.message = message
        self.code = code

    @property
    def status_code(self) -> int:
        return 404 if self.code == "not_found" else 400


async def domain_error_handler(_request: Request, exc: DomainError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message, "code": exc.code})
