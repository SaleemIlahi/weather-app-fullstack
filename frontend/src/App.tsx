import { useEffect, useState } from "react";
import S from "./App.module.css";
import Icon from "./components/Icon";
import Card from "./components/Card";
import { dateformat } from "./utils/dateformat";
import { useApi } from "./hook/useApi";

// Location
interface Location {
  city: string;
  country: string;
}

// Weather
interface Weather {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather: string;
  description: string;
  weather_icon: string;
  dt: number;
  dt_txt?: string;
}

// Current Weather
interface CurrentWeather {
  location: Location;
  weather: Weather;
}

interface CurrentWeatherResponse {
  status: number;
  message: string;
  data: CurrentWeather;
}

// Forecast
export interface ForecastWeather {
  location: Location;
  weather: Weather[];
}

export interface ForecastWeatherResponse {
  status: number;
  message: string;
  data: ForecastWeather;
}

type WeatherParams =
  | { city: string }
  | { lat: number; lon: number }
  | null
  | undefined;

function App() {
  const [search, setSearch] = useState<string>("");
  const [forecast, setForecast] = useState<Record<string, Weather[]> | null>(
    null
  );
  const [error, setError] = useState<{
    message: string;
    visible: boolean;
  } | null>(null);

  const [activeDay, setActiveDay] = useState<string>("");
  const [weatherData, setWeatherData] = useState<CurrentWeather | null>(null);
  const handleOnSearch = (value: string) => {
    setSearch(() => value);
  };
  const { request, loading } = useApi();

  const groupByDate = (
    list: Weather[],
    options: Intl.DateTimeFormatOptions
  ) => {
    return list.reduce<Record<string, Weather[]>>((acc, item) => {
      if (!item.dt) return acc;
      const date = dateformat(item.dt, options);

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(item);
      return acc;
    }, {});
  };

  const currentWeather = async (params: WeatherParams) => {
    try {
      let query = "";

      if (!params) return;

      if ("city" in params) {
        query = `city=${encodeURIComponent(params.city)}`;
      } else if ("lat" in params && "lon" in params) {
        query = `lat=${params.lat}&lon=${params.lon}`;
      }
      const res = await request<CurrentWeatherResponse>(
        "GET",
        `weather?${query}`
      );
      if (res.status === 200) {
        res.data.location.country = `https://flagcdn.com/${res.data.location.country.toLowerCase()}.svg`;
        res.data.weather.weather_icon = `https://openweathermap.org/img/wn/${res.data.weather.weather_icon}.png`;
        setWeatherData(res.data);
      } else {
        setError({
          message: res.message || "Failed to fetch current weather.",
          visible: true,
        });
      }
    } catch (error) {
      setError({
        message: "Something went wrong while fetching current weather.",
        visible: true,
      });
    }
  };

  const forecastWeather = async (params: WeatherParams) => {
    try {
      let query = "";

      if (!params) return;

      if ("city" in params) {
        query = `city=${encodeURIComponent(params.city)}`;
      } else if ("lat" in params && "lon" in params) {
        query = `lat=${params.lat}&lon=${params.lon}`;
      }
      const res = await request<ForecastWeatherResponse>(
        "GET",
        `forecast?${query}`
      );
      if (res.status === 200) {
        let forecastByDate = groupByDate(res.data.weather, {
          weekday: "short",
        });
        setForecast(forecastByDate);
        setActiveDay(Object.keys(forecastByDate)[0]);
      } else {
        setError({
          message: res.message || "Failed to fetch forecast.",
          visible: true,
        });
      }
    } catch (error) {
      setError({
        message: "Something went wrong while fetching forecast.",
        visible: true,
      });
    }
  };
  let fetchlanlon = async () => {
    try {
      const res = await request<{ city: string }>(
        "GET",
        `https://ipapi.co/json/`,
        "new"
      );
      currentWeather({ city: res?.city });
      forecastWeather({ city: res?.city });
    } catch (error) {
      currentWeather({ city: "chennai" }); //fallback city
      forecastWeather({ city: "chennai" }); //fallback city
    }
  };
  useEffect(() => {
    fetchlanlon();
  }, []);

  useEffect(() => {
    if (!error) return;

    const hideTimer = setTimeout(() => {
      setError((prev) => (prev ? { ...prev, visible: false } : null));
    }, 4000);

    const clearTimer = setTimeout(() => {
      setError(null);
    }, 5000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
  }, [error]);

  const handleSearch = (v: string = "") => {
    const value = v.trim();

    if (!value) return;

    // lat,lon pattern
    const latLonRegex =
      /^-?(?:[0-8]?\d(?:\.\d+)?|90(?:\.0+)?),\s*-?(?:1[0-7]\d(?:\.\d+)?|180(?:\.0+)?|(?:[0-9]?\d(?:\.\d+)?))$/;

    // city name pattern
    const cityRegex = /^[a-zA-Z\s]{2,}$/;

    if (latLonRegex.test(value)) {
      const [lat, lon] = value.split(",").map(Number);

      // call API with lat/lon
      currentWeather({ lat: lat, lon: lon });
      forecastWeather({ lat: lat, lon: lon });
      return;
    }

    if (cityRegex.test(value)) {
      // call API with city
      currentWeather({ city: value });
      forecastWeather({ city: value });
      return;
    }

    // invalid input
    alert("Enter a valid city or latitude,longitude");
  };

  return (
    <div className={S.main}>
      {error && (
        <div className={`${S.error} ${error.visible ? S.show : S.hide}`}>
          <span>
            <Icon n="alert" c="#ff4d4f" />
          </span>
          <p>{error.message}</p>
        </div>
      )}
      <div className={S.cnt}>
        <div className={S.left}>
          <div className={S.search}>
            <div className={S.input}>
              <input
                type="text"
                placeholder="Search by city or lantitude,longitude"
                value={search}
                onChange={(e) => handleOnSearch(e.target.value)}
              />
            </div>
            <div className={S.icon} onClick={() => handleSearch(search)}>
              <Icon n="search" />
            </div>
          </div>
          <div className={S.weather_card}>
            {loading ? (
              <div
                className={S.shimmer_box}
                style={{
                  width: "60%",
                  height: "300px",
                }}
              />
            ) : (
              <>
                <h2 className={S.city}>
                  Hello, {weatherData?.location.city}
                  <img
                    className={S.country}
                    src={weatherData?.location.country}
                    alt="in"
                  />
                  &#128075; !
                </h2>
                <div className={S.data}>
                  <h1 className={S.temp}>
                    {weatherData?.weather.temp.toFixed(0)}
                    <sup>°</sup>
                  </h1>

                  <div className={S.metrics}>
                    <div className={S.metric}>
                      <div className={S.metric_icon}>
                        <Icon w={22} h={22} n="wind" />
                      </div>
                      {(Number(weatherData?.weather.wind_speed) * 3.6).toFixed(
                        1
                      )}{" "}
                      km/h
                    </div>
                    <div className={S.metric}>
                      <div className={S.metric_icon}>
                        <Icon w={22} h={22} n="humidity" />
                      </div>
                      {weatherData?.weather.humidity}%
                    </div>
                  </div>
                </div>
                <div className={S.condition}>
                  <img
                    src={weatherData?.weather.weather_icon}
                    alt="weather_icon"
                  />
                  <h1>{weatherData?.weather.weather}</h1>
                </div>
              </>
            )}
          </div>

          <div className={S.days_card_cnt}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  className={S.shimmer_box}
                  style={{
                    width: "100px",
                    height: "150px",
                  }}
                />
              ))
            ) : forecast ? (
              Object.entries(forecast).map(([k, v]) => (
                <div
                  key={k}
                  onClick={() => {
                    setActiveDay(k);
                  }}
                  className={S.days_card}
                >
                  <Card
                    {...v[0]}
                    options={{
                      weekday: "short",
                    }}
                    active={activeDay}
                  />
                </div>
              ))
            ) : (
              <div>error</div>
            )}
          </div>
        </div>
        <div className={S.right}>
          <div className={S.forecast_cnt}>
            <div className={S.title}>
              <h3>Weather Forecast</h3>
              <h4 className={S.label}>
                {dateformat(Number(weatherData?.weather.dt), {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </h4>
            </div>
            <div className={S.forecast}>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    className={S.shimmer_box}
                    style={{
                      width: "100px",
                      height: "150px",
                    }}
                  />
                ))
              ) : forecast ? (
                Object.entries(forecast)
                  .filter(
                    ([k, _]) => activeDay.toLowerCase() === k.toLowerCase()
                  )
                  .map(([_, v]) =>
                    v.map((o) => (
                      <div key={o.dt}>
                        <Card
                          {...o}
                          options={{
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }}
                          active={null}
                          classname={"true"}
                        />
                      </div>
                    ))
                  )
              ) : (
                <div>error</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
