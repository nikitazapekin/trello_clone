import { MAX_RESULTS_CONSTANT, ORDER_BY_CONSTANT, SINGLE_EVENTS_CONSTANT } from "@constants";
import type { AxiosResponse } from "axios";
import type { CalendarEvent } from "src/types/googleCalendarTypes";

import { $api2 } from ".";

export default class GoogleCalendarService {
  static async fetchEvents(
    accessToken: string
  ): Promise<AxiosResponse<{ items: CalendarEvent[] }>> {
    const timeMin = new Date().toISOString();

    return $api2.get(`/calendars/primary/events`, {
      params: {
        maxResults: MAX_RESULTS_CONSTANT,
        orderBy: ORDER_BY_CONSTANT,
        singleEvents: SINGLE_EVENTS_CONSTANT,
        timeMin,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}
