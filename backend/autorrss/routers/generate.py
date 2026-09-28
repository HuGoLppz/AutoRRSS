from fastapi import APIRouter

from .. import generation
from ..schemas import GenerateRequest, GenerateResult

router = APIRouter(tags=["generate"])


@router.post("/generate", response_model=GenerateResult)
def generate_content(payload: GenerateRequest):
    return generation.generate_content(payload)
