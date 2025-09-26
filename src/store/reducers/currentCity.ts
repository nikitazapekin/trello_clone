import { createReducer } from "@reduxjs/toolkit";
import type { CurrentCityTypes } from "@types/currentCityTypes";

import {
  fetchCurrentCityFailure,
  fetchCurrentCityRequest,
  fetchCurrentCitySuccess,
  setCurrentCityName,
} from "@store/actions/currentCity";

const initialState: CurrentCityTypes = {
  city: "",
  loading: false,
  error: null,
};

export const currentCity = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchCurrentCityRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCurrentCitySuccess, (state, action) => {
      state.city = action.payload;
      state.loading = false;
    })
    .addCase(fetchCurrentCityFailure, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    })
    .addCase(setCurrentCityName, (state, action) => {
      state.city = action.payload.city;
    });
});
