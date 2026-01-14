from fastapi import APIRouter, Query
from ..schemas.weather import (
    CurrentWeatherResponse,
    ErrorResponse,
    ForecastWeatherResponse,
)
from ..services.weather_service import current_weather, forecast_weather

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
        data = current_weather(city, lat, lon)
        return data
    except Exception as e:
        print(e)
        return ErrorResponse(status=500, message="Internal Server Error")


@router.get(
    "/forecast",
    responses={
        200: {"model": ForecastWeatherResponse},
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
        504: {"model": ErrorResponse},
    },
)
def get_forecast(
    city: str = Query(None), lat: float = Query(None), lon: float = Query(None)
):
    try:
        data = forecast_weather(city, lat, lon)
        return data
    except Exception as e:
        print(e, "5")
        return ErrorResponse(status=500, message="Internal Server Error")
