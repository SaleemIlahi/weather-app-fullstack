import React from "react";
import S from "../styles/card.module.css";
import { dateformat } from "../utils/dateformat";
interface CardData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather: string;
  description: string;
  weather_icon: string;
  dt: number;
  dt_txt?: string | null;
  options: Intl.DateTimeFormatOptions;
  active?: string | null;
  classname?: string | null;
}

const Card: React.FC<CardData> = (props) => {
  const data = props;
  const dateFormat = dateformat(data.dt, data.options);
  const URL = "https://openweathermap.org/img/wn/";

  const weatherIcon = (v: string): string => {
    const url = `${URL}${v}.png`;
    return url;
  };

  return (
    <div
      className={`${S.cnt} ${
        data.active?.toLowerCase() === dateFormat?.toLowerCase() ||
        data.active === null
          ? S.active
          : ""
      } ${data.classname && S.custom}`}
    >
      <div className={S.date}>{dateFormat}</div>
      <h1 className={S.temp}>
        {data.temp.toFixed(0)}
        <sup>o</sup>
      </h1>
      <div className={S.condition}>
        <div className={S.label}>{data.weather}</div>
        <img src={weatherIcon(data.weather_icon)} alt={data.weather_icon} />
      </div>
    </div>
  );
};

export default Card;
