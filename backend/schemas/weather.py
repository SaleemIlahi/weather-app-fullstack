from pydantic import BaseModel


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
    dt: int


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
