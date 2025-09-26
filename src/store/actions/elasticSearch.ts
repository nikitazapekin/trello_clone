import { createAction } from "@reduxjs/toolkit";
import type { CityParams } from "@types/apiTypes";
import type { CityCoordinats } from "@types/cityCoordinats";
import type { OpenWeatherGeoResponse } from "@types/CitySearchResponseTypes";

export const fetchCitiesRequest = createAction<CityParams>("city/fetchCitiesRequest");
export const fetchClearCitiesRequest = createAction<CityParams>("city/fetchClearCitiesRequest");
export const fetchSuggestedCityCoordinats = createAction<CityCoordinats>(
  "city/fetchSuggestedCityCoordinats"
);
export const fetchCitiesSuccess = createAction<OpenWeatherGeoResponse>("city/fetchCitiesSuccess");
export const fetchCitiesFailure = createAction<string>("city/fetchCitiesFailure");
export const fetchCitiesActive = createAction<boolean>("city/fetchCitiesActive");
export const fetchElasticActive = createAction<boolean>("city/fetchElasticActive");
export const fetchHasLastSearch = createAction<boolean>("city/fetchHasLastSearch");
