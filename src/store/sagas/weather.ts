import type { SagaIterator } from "redux-saga";
import { takeLatest } from "redux-saga/effects";

import {
  fetchHourlyWeatherByCityRequest,
  fetchHourlyWeatherByCoordsRequest,
  fetchWeeklyWeatherByCityRequest,
  fetchWeeklyWeatherByCoordsRequest,
} from "../actions/weather";

import { fetchHourlyWeatherByCity } from "./hourlyWeatherByCity";
import { fetchHourlyWeatherByCoords } from "./hourlyWeatherByCoordinats";
import { fetchWeeklyWeatherByCity } from "./weeklyWeatherByCity";
import { fetchWeeklyWeatherByCoords } from "./weeklyWeatherByCoordinats";

export function* Weather(): SagaIterator {
  yield takeLatest(fetchWeeklyWeatherByCoordsRequest.type, fetchWeeklyWeatherByCoords);
  yield takeLatest(fetchWeeklyWeatherByCityRequest.type, fetchWeeklyWeatherByCity);
  yield takeLatest(fetchHourlyWeatherByCoordsRequest.type, fetchHourlyWeatherByCoords);
  yield takeLatest(fetchHourlyWeatherByCityRequest.type, fetchHourlyWeatherByCity);
}
