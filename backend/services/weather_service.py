import requests
from dotenv import load_dotenv
import os
from ..schemas.weather import (
    CurrentWeatherResponse,
    CurrentWeather,
    Location,
    Weather,
    ErrorResponse,
    LatLon,
    ForecastWeather,
    ForecastWeatherResponse,
)
from requests.exceptions import RequestException, Timeout

load_dotenv()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/"
LAT_LON_URL = "https://api.openweathermap.org/geo/1.0/direct"


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
        if getattr(e, "response", None) is not None:
            try:
                msg = e.response.json().get("message", e.response.text)
            except ValueError:
                msg = e.response.text
        else:
            msg = str(e)

        return ErrorResponse(
            status=503,
            message=msg or "Weather service unavailable",
        )
    except Exception as e:
        return ErrorResponse(
            status=500,
            message="Internal server error",
        )


# get latitude and longitude using city name
def get_lat_lon(city: str = None) -> LatLon | ErrorResponse:
    try:
        response = requests.get(
            f"{LAT_LON_URL}",
            params={
                "q": city,
                "appid": WEATHER_API_KEY,
                "limit": 1,
            },
            timeout=5,
        )
        response.raise_for_status()
        data = response.json()
        res = {
            "city": data[0]["name"],
            "country": data[0]["country"],
            "lat": data[0]["lat"],
            "lon": data[0]["lon"],
        }
        return LatLon(**res)

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
        return ErrorResponse(
            status=500,
            message="Internal server error",
        )


# forecast
def forecast_weather(
    city: str = None, lat: float = None, lon: float = None
) -> ForecastWeatherResponse | ErrorResponse:
    try:
        params = {}
        location = {}
        res_data = []
        if lat is not None and lon is not None:
            params["lat"] = float(lat)
            params["lon"] = float(lon)
        elif city is not None:
            lan_lon = get_lat_lon(city)
            print(lan_lon)
            params["lat"] = float(lan_lon.lat)
            params["lon"] = float(lan_lon.lon)
        else:
            return ErrorResponse(
                status=400,
                message="Either city or both latitude and longitude must be provided",
            )
        params["appid"] = WEATHER_API_KEY
        params["units"] = "metric"
        response = requests.get(
            f"{WEATHER_BASE_URL}forecast",
            params=params,
            timeout=5,
        )
        response.raise_for_status()
        data = response.json()

        for item in data["list"]:
            weather = {}
            weather["temp"] = item["main"]["temp"]
            weather["feels_like"] = item["main"]["feels_like"]
            weather["humidity"] = item["main"]["humidity"]
            weather["wind_speed"] = item["wind"]["speed"]
            weather["weather"] = item["weather"][0]["main"]
            weather["description"] = item["weather"][0]["description"]
            weather["weather_icon"] = item["weather"][0]["icon"]
            weather["dt"] = item["dt"]
            weather["dt_txt"] = item["dt_txt"]
            res_data.append(weather)

        location["city"] = data["city"]["name"]
        location["country"] = data["city"]["country"]
        return ForecastWeatherResponse(
            status=200,
            message="success",
            data=ForecastWeather(
                location=Location(**location), weather=[Weather(**w) for w in res_data]
            ),
        )
    except Timeout:
        return ErrorResponse(
            status=504,
            message="Weather service timeout",
        )
    except RequestException as e:
        if getattr(e, "response", None) is not None:
            try:
                msg = e.response.json().get("message", e.response.text)
            except ValueError:
                msg = e.response.text
        else:
            msg = str(e)

        return ErrorResponse(
            status=503,
            message=msg or "Weather service unavailable",
        )

    except Exception as e:
        return ErrorResponse(
            status=500,
            message="Internal server error",
        )
