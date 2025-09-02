from fastapi import APIRouter, HTTPException, Request
from starlette.responses import JSONResponse
from ..utils.model_registry import MODELS

router = APIRouter()

@router.get("/", response_class=JSONResponse)
async def list_models(request: Request):
    all_models = MODELS.get_all_models()
    try:
        return JSONResponse(content={"models": list(all_models)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{model_name}", response_class=JSONResponse)
async def get_model_details(model_name: str):
    try:
        model_class = MODELS.get_model_class(model_name)
        criterion_options = [name for name, _ in model_class.criterion_options]
        optimizer_options = [name for name, _ in model_class.optimizer_options]
        return JSONResponse(content={
            "model_name": model_name,
            "criterion_options": criterion_options,
            "optimizer_options": optimizer_options
        })
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

