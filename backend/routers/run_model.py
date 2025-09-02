from fastapi import APIRouter, HTTPException, Request, WebSocket, WebSocketDisconnect
import asyncio
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
    

# WebSocket endpoint for streaming training updates
@router.websocket("/ws/{model_name}/train")
async def websocket_train_model(websocket: WebSocket, model_name: str):
    await websocket.accept()
    try:
        # Receive initial training configuration from client
        payload = await websocket.receive_json()
        input_dim = payload.get("input_dim", 1)
        output_dim = payload.get("output_dim", 1)
        learning_rate = payload.get("learning_rate", 0.01)
        input_data = payload.get("input_data")
        output_data = payload.get("output_data")
        criterion_choice = payload.get("criterion_choice")
        optimizer_choice = payload.get("optimizer_choice")
        num_epochs = payload.get("num_epochs", 100)

        if input_data is None or output_data is None:
            await websocket.send_json({"error": "Input and output data must be provided."})
            await websocket.close(code=1003)
            return

        model_class = MODELS.get_model_class(model_name)
        model_instance = model_class()
        model_instance.create_model(input_dim, output_dim)
        model_instance.set_settings(learning_rate, input_data, output_data, criterion_choice)

        # Add this websocket client to the model instance for streaming
        model_instance.add_client(websocket)

        # Start training and stream updates
        train_result = await model_instance.train_model(input_dim, output_dim, optimizer_choice, num_epochs, stream_data=True)

        if isinstance(train_result, Exception):
            await websocket.send_json({"error": str(train_result)})
            await websocket.close(code=1003)
            return

        await websocket.send_json({"status": "Training completed successfully."})
        await websocket.close()
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"error": str(e)})
        await websocket.close(code=1011)

