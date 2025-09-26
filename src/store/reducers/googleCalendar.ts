import { createReducer } from "@reduxjs/toolkit";
import type { CalendarEvent } from "src/types/googleCalendarTypes";

import {
  cleanUpEvents,
  fetchCalendarEventsFailure,
  fetchCalendarEventsRequest,
  fetchCalendarEventsSuccess,
} from "@store/actions/googleCalendar";

interface CalendarEventsState {
  loading: boolean;
  error: string | null;
  events: CalendarEvent[];
}

const initialState: CalendarEventsState = {
  loading: false,
  error: null,
  events: [],
};

export const calendar = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchCalendarEventsRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCalendarEventsSuccess, (state, action) => {
      state.loading = false;
      state.events = action.payload.events;
    })
    .addCase(fetchCalendarEventsFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(cleanUpEvents, (state) => {
      state.events = [];
    });
});
