import { ERROR_CONSTANTS } from "@constants/errors";
import type { AxiosResponse } from "axios";
import type { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import type { CalendarEvent } from "src/types/googleCalendarTypes";

import GoogleCalendarService from "@api/googleCalendarService";
import {
  fetchCalendarEventsFailure,
  fetchCalendarEventsRequest,
  fetchCalendarEventsSuccess,
} from "@store/actions/googleCalendar";

function* fetchCalendarEvents(action: ReturnType<typeof fetchCalendarEventsRequest>): SagaIterator {
  const { UNKNOWN_ERROR } = ERROR_CONSTANTS.API_ERRORS;

  try {
    const { accessToken } = action.payload;

    const response: AxiosResponse<{ items: CalendarEvent[] }> = yield call(
      GoogleCalendarService.fetchEvents,
      accessToken
    );

    yield put(fetchCalendarEventsSuccess({ events: response.data.items }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : UNKNOWN_ERROR;

    yield put(fetchCalendarEventsFailure(message));
  }
}

export function* CalendarEvents(): SagaIterator {
  yield takeLatest(fetchCalendarEventsRequest.type, fetchCalendarEvents);
}
