export const API_CONFIG = {
  PARAMS: {
    EXCLUDE: "minutely,hourly",
    METRIC: "metric",
    LANG: "ru",
    LIMIT_OF_CITIES_FOR_SUGGESTION: 5,
  },
};

export const UI_CONFIG = {
  DEBOUNCE: {
    DELAY: 300,
  },
  SUGGESTIONS: {
    LIMIT: 5,
    HEIGHT: 100,
    RELATIVE: "relative" as const,
    ABSOLUTE: "absolute" as const,
  },
};
