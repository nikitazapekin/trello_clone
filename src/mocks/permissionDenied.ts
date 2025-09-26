export const GEOLOCATION_DENIED_TEST = {
  DESCRIPTION: "Test 5",
  IT: {
    SHOULD_SHOW_GEOLOCATION_TURN_OFF:
      "should show geolocation turn off message when permission is denied",
  },
  CONSTANTS: {
    URLS: {
      BASE_URL: "http://localhost:4000",
    },
    TEST_IDS: {
      GEOLOCATION_TURN_OFF: "geolocation-is-turn-off",
    },
    GEOLOCATION: {
      ERROR: {
        CODE: 1,
        MESSAGE: "User denied Geolocation",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      },
    },
  },
};
