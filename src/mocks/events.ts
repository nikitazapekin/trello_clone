export const EVENTS_MOCK = [
  {
    id: "event1",
    summary: "JS internships Daily Meeting",
    start: { dateTime: "2025-08-20T10:00:00+03:00" },
    end: { dateTime: "2025-08-20T10:30:00+03:00" },
    description: "Test meeting description",
  },
];

export const CALENDAR_EVENTS_TEST = {
  DESCRIPTION: "Calendar Events Test",
  IT: {
    SHOULD_MANIPULATE_REDUX_AFTER_CLICK: "should directly manipulate Redux store after click",
  },
  CONSTANTS: {
    URLS: {
      BASE_URL: "http://localhost:4000",
      GOOGLE_APIS: "https://www.googleapis.com/**",
      GOOGLE_ACCOUNTS: "https://accounts.google.com/**",
    },
    TEST_IDS: {
      EVENT_LIST: "event-list",
      EVENT: "event",
    },
    SELECTORS: {
      BUTTON: "button",
    },
    TEXT: {
      SIGN_IN: "Sign in",
      EVENT_TITLE: "JS internships Daily Meeting",
      EVENT_TIME: "10:00",
    },
    ACTIONS: {
      CALENDAR_FETCH_SUCCESS: "calendar/fetchSuccess",
    },
    TIMEOUTS: {
      EVENT_VISIBILITY: 5000,
    },
    LOG_MESSAGES: {
      FOUND_STORE: "Found Redux store, will use it after click",
      STORE_NOT_FOUND: "Store not found, using DOM manipulation",
    },
  },
};
