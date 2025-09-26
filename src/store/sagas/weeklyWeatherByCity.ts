import type { FiveDayForecastResponse } from "@types/apiTypes";
import { getErrorMessage } from "@utils/helpers/getErrorMessage/getErrorMessage";
import type { AxiosResponse } from "axios";
import type { SagaIterator } from "redux-saga";
import { call, put } from "redux-saga/effects";

import WeatherService from "@api/weatherService";
import type { fetchWeeklyWeatherByCityRequest } from "@store/actions/weather";
import { fetchWeeklyWeatherFailure, fetchWeeklyWeatherSuccess } from "@store/actions/weather";

export function* fetchWeeklyWeatherByCity(
  action: ReturnType<typeof fetchWeeklyWeatherByCityRequest>
): SagaIterator {
  try {
    const response: AxiosResponse<FiveDayForecastResponse> = yield call(
      WeatherService.getWeeklyWeatherByCity,
      action.payload
    );

    yield put(fetchWeeklyWeatherSuccess(response.data));
  } catch (error) {
    yield put(fetchWeeklyWeatherFailure(getErrorMessage(error)));
  }
}
