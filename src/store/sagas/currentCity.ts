import type { OpenWeatherGeoResponse } from "@types/CitySearchResponseTypes";
import { getErrorMessage } from "@utils/helpers/getErrorMessage/getErrorMessage";
import type { AxiosResponse } from "axios";
import type { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import WeatherService from "@api/weatherService";
import {
  fetchCurrentCityFailure,
  fetchCurrentCityRequest,
  fetchCurrentCitySuccess,
} from "@store/actions/currentCity";

function* fetchCurrentCity(action: ReturnType<typeof fetchCurrentCityRequest>): SagaIterator {
  try {
    const { latitude, longitude } = action.payload;

    const response: AxiosResponse<OpenWeatherGeoResponse> = yield call(
      WeatherService.getCityNameByCoordinats.bind(WeatherService),
      { latitude, longitude }
    );

    if (Array.isArray(response.data) && response.data.length > 0) {
      const cityName = response.data[0].name;

      yield put(fetchCurrentCitySuccess(cityName));
    } else {
      yield put(fetchCurrentCityFailure("No city found"));
    }
  } catch (error) {
    yield put(fetchCurrentCityFailure(getErrorMessage(error)));
  }
}

export function* CurrentCity(): SagaIterator {
  yield takeLatest(fetchCurrentCityRequest.type, fetchCurrentCity);
}
