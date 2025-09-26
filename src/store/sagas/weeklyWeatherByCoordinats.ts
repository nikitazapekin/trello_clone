import type { FiveDayForecastResponse } from "@types/apiTypes";
import { getErrorMessage } from "@utils/helpers/getErrorMessage/getErrorMessage";
import type { AxiosResponse } from "axios";
import type { SagaIterator } from "redux-saga";
import { call, put } from "redux-saga/effects";

import WeatherService from "@api/weatherService";
import type { fetchWeeklyWeatherByCoordsRequest } from "@store/actions/weather";
import { fetchWeeklyWeatherFailure, fetchWeeklyWeatherSuccess } from "@store/actions/weather";

export function* fetchWeeklyWeatherByCoords(
  action: ReturnType<typeof fetchWeeklyWeatherByCoordsRequest>
): SagaIterator {
  try {
    const response: AxiosResponse<FiveDayForecastResponse> = yield call(
      WeatherService.getWeeklyWeatherByCoordinats.bind(WeatherService),
      action.payload
    );

    yield put(fetchWeeklyWeatherSuccess(response.data));
  } catch (error) {
    yield put(fetchWeeklyWeatherFailure(getErrorMessage(error)));
  }
}
