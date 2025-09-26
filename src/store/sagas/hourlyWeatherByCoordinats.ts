import type { FiveDayForecastResponse } from "@types/apiTypes";
import { getErrorMessage } from "@utils/helpers/getErrorMessage/getErrorMessage";
import type { AxiosResponse } from "axios";
import type { SagaIterator } from "redux-saga";
import { call, put } from "redux-saga/effects";

import WeatherService from "@api/weatherService";
import type { fetchHourlyWeatherByCoordsRequest } from "@store/actions/weather";
import { fetchHourlyWeatherFailure, fetchHourlyWeatherSuccess } from "@store/actions/weather";

export function* fetchHourlyWeatherByCoords(
  action: ReturnType<typeof fetchHourlyWeatherByCoordsRequest>
): SagaIterator {
  try {
    const response: AxiosResponse<FiveDayForecastResponse> = yield call(
      WeatherService.getHourlyWeatherByCoordinats.bind(WeatherService),
      action.payload
    );

    yield put(fetchHourlyWeatherSuccess(response.data));
  } catch (error) {
    yield put(fetchHourlyWeatherFailure(getErrorMessage(error)));
  }
}
