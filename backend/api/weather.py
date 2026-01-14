from fastapi import APIRouter, Query
from ..schemas.weather import CurrentWeatherResponse, ErrorResponse
from ..services.weather_service import current_weather

router = APIRouter()


@router.get(
    "/weather",
    responses={
        200: {"model": CurrentWeatherResponse},
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
        504: {"model": ErrorResponse},
    },
)
def get_weather(
    city: str = Query(None), lat: float = Query(None), lon: float = Query(None)
):
    try:
        data = current_weather(city, float(lat), float(lon))
        return data
    except Exception as e:
        print(e)
        return ErrorResponse(status=500, message="Internal Server Error")
