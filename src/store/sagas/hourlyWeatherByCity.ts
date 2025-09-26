import type { FiveDayForecastResponse } from "@types/apiTypes";
import { getErrorMessage } from "@utils/helpers/getErrorMessage/getErrorMessage";
import type { AxiosResponse } from "axios";
import type { SagaIterator } from "redux-saga";
import { call, put } from "redux-saga/effects";

import WeatherService from "@api/weatherService";
import type { fetchHourlyWeatherByCityRequest } from "@store/actions/weather";
import { fetchHourlyWeatherFailure, fetchHourlyWeatherSuccess } from "@store/actions/weather";

export function* fetchHourlyWeatherByCity(
  action: ReturnType<typeof fetchHourlyWeatherByCityRequest>
): SagaIterator {
  try {
    const response: AxiosResponse<FiveDayForecastResponse> = yield call(
      WeatherService.getHourlyWeatherByCity,
      action.payload
    );

    yield put(fetchHourlyWeatherSuccess(response.data));
  } catch (error) {
    yield put(fetchHourlyWeatherFailure(getErrorMessage(error)));
  }
}
