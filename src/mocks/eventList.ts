export const EVENT_LIST_MOCKS = {
  EVENTS: [
    {
      id: "1",
      summary: "Test Event 1",
      start: { dateTime: "2025-01-01T10:00:00" },
      end: { dateTime: "2025-01-01T11:00:00" },
      description: "Description 1",
    },
    {
      id: "2",
      summary: "Test Event 2",
      start: { dateTime: "2025-01-02T11:00:00" },
      end: { dateTime: "2025-01-02T12:00:00" },
      description: "Description 2",
    },
  ],
  FORMATTED_TIME: {
    EVENT_1: "10:00",
    EVENT_2: "11:00",
  },
};

export const EVENT_LIST_TEST = {
  DESCRIPTION: "EventList Component",
  IT: {
    RENDERS_EMPTY_LIST: "renders empty list message when no events",
    RENDERS_EVENTS_LIST: "renders list of events with dateTime",
  },
  CONSTANTS: {
    EMPTY_LIST_TEXT: "No events at the moment",
  },
};

export const ELASTIC_HOOK_TEST = {
  DESCRIPTION: "useElastic hook",
  IT: {
    RETURNS_INITIAL_VALUES: "should return initial values and functions",
    FORMATS_CITY_NAME: "should format city name correctly",
  },

  INITIAL_VALUES: {
    INPUT_VALUE: "",
    SHOW_SUGGESTIONS: false,
  },
};
