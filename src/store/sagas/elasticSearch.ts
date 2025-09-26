import { ERROR_CONSTANTS } from "@constants/errors";
import type { OpenWeatherGeoResponse } from "@types/CitySearchResponseTypes";
import type { AxiosResponse } from "axios";
import type { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import WeatherService from "@api/weatherService";
import {
  fetchCitiesFailure,
  fetchCitiesRequest,
  fetchCitiesSuccess,
} from "@store/actions/elasticSearch";

function* fetchCitiesSaga(action: ReturnType<typeof fetchCitiesRequest>): SagaIterator {
  const { UNKNOWN_ERROR } = ERROR_CONSTANTS.API_ERRORS;

  try {
    const response: AxiosResponse<OpenWeatherGeoResponse> = yield call(
      WeatherService.getCitiesByQuery,
      action.payload
    );

    yield put(fetchCitiesSuccess(response.data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : UNKNOWN_ERROR;

    yield put(fetchCitiesFailure(message));
  }
}

export function* FetchCities(): SagaIterator {
  yield takeLatest(fetchCitiesRequest.type, fetchCitiesSaga);
}
