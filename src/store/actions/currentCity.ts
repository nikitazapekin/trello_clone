import { createAction } from "@reduxjs/toolkit";
import type { CityCoordinats } from "@types/cityCoordinats";
import type { CurrentCityTypes } from "@types/currentCityTypes";

export const setCurrentCityName = createAction<CurrentCityTypes>("cityName");

export const fetchCurrentCityRequest = createAction<CityCoordinats>("currentCity/fetchRequest");
export const fetchCurrentCitySuccess = createAction<string>("currentCity/fetchSuccess");
export const fetchCurrentCityFailure = createAction<string>("currentCity/fetchFailure");
