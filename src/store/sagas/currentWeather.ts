import type { CurrentWeatherResponse } from "@types/apiTypes";
import type { AxiosResponse } from "axios";
import type { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import WeatherService from "@api/weatherService";

import {
  fetchWeatherByCityRequest,
  fetchWeatherByCoordsRequest,
  fetchWeatherFailure,
  fetchWeatherSuccess,
} from "../actions/currentWeather";

function* fetchWeatherByCoords(
  action: ReturnType<typeof fetchWeatherByCoordsRequest>
): SagaIterator {
  try {
    const response: AxiosResponse<CurrentWeatherResponse> = yield call(
      WeatherService.getCurrentWeatherByCoordinats.bind(WeatherService),
      action.payload
    );

    yield put(fetchWeatherSuccess(response.data));
  } catch (error) {
    yield put(fetchWeatherFailure(getErrorMessage(error)));
  }
}

function* fetchWeatherByCity(action: ReturnType<typeof fetchWeatherByCityRequest>): SagaIterator {
  try {
    const response: AxiosResponse<CurrentWeatherResponse> = yield call(
      WeatherService.getCurrentWeatherByCity,
      action.payload
    );

    yield put(fetchWeatherSuccess(response.data));
  } catch (error) {
    yield put(fetchWeatherFailure(getErrorMessage(error)));
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (typeof error === "string") return error;

  return "Unknown error occurred";
}

export function* CurrentWeather(): SagaIterator {
  yield takeLatest(fetchWeatherByCoordsRequest.type, fetchWeatherByCoords);
  yield takeLatest(fetchWeatherByCityRequest.type, fetchWeatherByCity);
}
