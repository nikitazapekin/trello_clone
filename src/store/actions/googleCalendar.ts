import { createAction } from "@reduxjs/toolkit";
import type { CalendarEvent } from "src/types/googleCalendarTypes";

interface FetchCalendarEventsRequestPayload {
  accessToken: string;
}

interface FetchCalendarEventsSuccessPayload {
  events: CalendarEvent[];
}

export const fetchCalendarEventsRequest =
  createAction<FetchCalendarEventsRequestPayload>("calendar/fetchRequest");

export const fetchCalendarEventsSuccess =
  createAction<FetchCalendarEventsSuccessPayload>("calendar/fetchSuccess");

export const fetchCalendarEventsFailure = createAction<string>("calendar/fetchFailure");

export const cleanUpEvents = createAction("calendar/cleanup");
