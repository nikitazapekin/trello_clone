export const SEARCH_WITH_NO_RESULTS = {
  DESCRIPTION: "Test 3",
  IT: {
    SHOULD_VALIDATE_API_RESPONSE_STRUCTURE:
      "should validate API response structure matches mock data",
  },
  CONSTANTS: {
    URLS: {
      BASE_URL: "http://localhost:4000",
      GEO_DIRECT_API: "**/geo/1.0/direct*",
    },
    TEST_IDS: {
      SPINNER: "spinner",
      NO_SUGGESTIONS: "no-suggestions",
    },
    SELECTORS: {
      INPUT: "input",
    },
    HTTP: {
      STATUS_OK: 200,
      METHOD_GET: "GET",
    },
    TEXT: {
      TEST_INPUT: "dddddddddddddddddddddddddddddddddd",
    },

    ALIASES: {
      GET_CITIES: "getCities",
    },
  },
};

export const EMPTY_ARRAY_MOCK: unknown = [];
