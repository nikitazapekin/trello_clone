export interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  description: string;
}

export interface GoogleCalendarEventResponse {
  kind: string;
  etag: string;
  summary: string;
  description: string;
  updated: string;
  timeZone: string;
  accessRole: string;
  defaultReminders: {
    method: string;
    minutes: number;
  }[];
  nextPageToken?: string;
  items: CalendarEvent[];
}

export interface GoogleAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface GoogleCalendarState {
  isSignedIn: boolean;
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
}
