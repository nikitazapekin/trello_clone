import { createAction } from "@reduxjs/toolkit";
import type { CurrentWeatherResponse } from "@types/apiTypes";

interface WeatherByCoordsParams {
  latitude: number;
  longitude: number;
}

interface WeatherByCityParams {
  city: string;
}

export const fetchWeatherByCoordsRequest = createAction<WeatherByCoordsParams>(
  "currentWeather/fetchByCoordsRequest"
);

export const fetchWeatherByCityRequest = createAction<WeatherByCityParams>(
  "currentWeather/fetchByCityRequest"
);

export const fetchWeatherSuccess = createAction<CurrentWeatherResponse>(
  "currentWeather/fetchSuccess"
);

export const fetchWeatherFailure = createAction<string>("currentWeather/fetchFailure");
