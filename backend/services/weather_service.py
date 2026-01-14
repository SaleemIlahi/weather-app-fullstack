import requests
from dotenv import load_dotenv
import os
from ..schemas.weather import (
    CurrentWeatherResponse,
    CurrentWeather,
    Location,
    Weather,
    ErrorResponse,
)
from requests.exceptions import RequestException, Timeout

load_dotenv()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
WEATHER_BASE_URL: str = "https://api.openweathermap.org/data/2.5/"


def current_weather(city: str = None, lat: float = None, lon: float = None):
    try:
        location = {}
        weather = {}
        params = {}

        if lat is not None and lon is not None:
            params["lat"] = float(lat)
            params["lon"] = float(lon)
        elif city is not None:
            params["q"] = city
        else:
            return ErrorResponse(
                status=400,
                message="Either city or both latitude and longitude must be provided",
            )

        params["appid"] = WEATHER_API_KEY
        params["units"] = "metric"
        response = requests.get(
            f"{WEATHER_BASE_URL}weather",
            params=params,
            timeout=5,
        )
        response.raise_for_status()
        data = response.json()

        location["city"] = data["name"]
        location["country"] = data["sys"]["country"]
        weather["temp"] = data["main"]["temp"]
        weather["feels_like"] = data["main"]["feels_like"]
        weather["humidity"] = data["main"]["humidity"]
        weather["wind_speed"] = data["wind"]["speed"]
        weather["weather"] = data["weather"][0]["main"]
        weather["description"] = data["weather"][0]["description"]
        weather["weather_icon"] = data["weather"][0]["icon"]
        weather["dt"] = data["dt"]
        return CurrentWeatherResponse(
            status=200,
            message="success",
            data=CurrentWeather(
                location=Location(**location), weather=Weather(**weather)
            ),
        )
    except Timeout:
        return ErrorResponse(
            status=504,
            message="Weather service timeout",
        )
    except RequestException as e:
        return ErrorResponse(
            status=503,
            message="Weather service unavailable",
        )
    except Exception as e:
        print(e)
        return ErrorResponse(
            status=500,
            message="Internal server error",
        )
