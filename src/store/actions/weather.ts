import { createAction } from "@reduxjs/toolkit";
import type { FiveDayForecastResponse } from "@types/apiTypes";

interface WeatherByCoordsParams {
  latitude: number;
  longitude: number;
}

interface WeatherByCityParams {
  city: string;
}

export const fetchWeeklyWeatherByCoordsRequest = createAction<WeatherByCoordsParams>(
  "weeklyWeather/fetchByCoordsRequest"
);

export const fetchWeeklyWeatherByCityRequest = createAction<WeatherByCityParams>(
  "weeklyWeather/fetchByCityRequest"
);

export const fetchWeeklyWeatherSuccess = createAction<FiveDayForecastResponse>(
  "weeklyWeather/fetchSuccess"
);

export const fetchWeeklyWeatherFailure = createAction<string>("weeklyWeather/fetchFailure");

export const fetchHourlyWeatherByCoordsRequest = createAction<WeatherByCoordsParams>(
  "hourlyWeather/fetchByCoordsRequest"
);

export const fetchHourlyWeatherByCityRequest = createAction<WeatherByCityParams>(
  "hourlyWeather/fetchByCityRequest"
);

export const fetchHourlyWeatherSuccess = createAction<FiveDayForecastResponse>(
  "hourlyWeather/fetchSuccess"
);

export const fetchHourlyWeatherFailure = createAction<string>("hourlyWeather/fetchFailure");
