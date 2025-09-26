import { createReducer } from "@reduxjs/toolkit";
import type { FiveDayForecastResponse } from "@types/apiTypes";

import {
  fetchHourlyWeatherByCityRequest,
  fetchHourlyWeatherByCoordsRequest,
  fetchHourlyWeatherFailure,
  fetchHourlyWeatherSuccess,
  fetchWeeklyWeatherByCityRequest,
  fetchWeeklyWeatherByCoordsRequest,
  fetchWeeklyWeatherFailure,
  fetchWeeklyWeatherSuccess,
} from "../actions/weather";

interface WeatherState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
  lastRequestType: "city" | "coords" | null;
  timeOfWeather: "weekly" | "hourly" | null;
}

const createInitialWeatherState = <T>(): WeatherState<T> => ({
  loading: false,
  error: null,
  data: null,
  lastRequestType: null,
  timeOfWeather: null,
});

export const weather = createReducer<WeatherState<FiveDayForecastResponse>>(
  createInitialWeatherState<FiveDayForecastResponse>(),
  (builder) => {
    builder
      .addCase(fetchWeeklyWeatherByCoordsRequest, (state) => {
        state.loading = true;
        state.error = null;
        state.lastRequestType = "coords";
        state.timeOfWeather = "weekly";
      })
      .addCase(fetchWeeklyWeatherByCityRequest, (state) => {
        state.loading = true;
        state.error = null;
        state.lastRequestType = "city";
        state.timeOfWeather = "weekly";
      })

      .addCase(fetchHourlyWeatherByCoordsRequest, (state) => {
        state.loading = true;
        state.error = null;
        state.lastRequestType = "coords";
        state.timeOfWeather = "hourly";
      })

      .addCase(fetchHourlyWeatherByCityRequest, (state) => {
        state.loading = true;
        state.error = null;
        state.lastRequestType = "city";
        state.timeOfWeather = "hourly";
      })

      .addCase(fetchHourlyWeatherSuccess, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHourlyWeatherFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWeeklyWeatherSuccess, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeeklyWeatherFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
);
