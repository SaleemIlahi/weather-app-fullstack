from pydantic import BaseModel, model_validator
from typing import Optional, List


class Location(BaseModel):
    city: str
    country: str


class Weather(BaseModel):
    temp: float
    feels_like: float
    humidity: int
    wind_speed: float
    weather: str
    description: str
    weather_icon: str
    dt: Optional[int] = None
    dt_txt: Optional[str] = None

    @model_validator(mode="after")
    def check_dt_or_dt_txt(self):
        if self.dt is None and self.dt_txt is None:
            raise ValueError("Either 'dt' or 'dt_txt' must be provided")
        return self


class CurrentWeather(BaseModel):
    location: Location
    weather: Weather


class CurrentWeatherResponse(BaseModel):
    status: int
    message: str
    data: CurrentWeather


class ErrorResponse(BaseModel):
    status: int
    message: str


# lat & lon
class LatLon(BaseModel):
    city: str
    country: str
    lat: float
    lon: float


# Forecast
class ForecastWeather(BaseModel):
    location: Location
    weather: List[Weather]


class ForecastWeatherResponse(BaseModel):
    status: int
    message: str
    data: ForecastWeather
