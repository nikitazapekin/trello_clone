import { createReducer } from "@reduxjs/toolkit";
import type { CurrentCoordinatsState } from "@types/coordinatsTypes";

import { setCoordinats, setGeolocationDenied } from "@store/actions/currentCoordinats";

const initialState: CurrentCoordinatsState = {
  latitude: null,
  longitude: null,
  isGeolocationDenied: false,
};

export const currentCoordinats = createReducer(initialState, (builder) => {
  builder
    .addCase(setCoordinats, (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    })
    .addCase(setGeolocationDenied, (state) => {
      state.isGeolocationDenied = true;
    });
});
