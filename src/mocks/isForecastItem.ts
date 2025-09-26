import type { ForecastItem } from "@types/apiTypes";

export const FORECAST_ITEM_TEST = {
  DESCRIPTION: "isForecastItem",
  IT: {
    VALID_ITEM: "should return true for a valid ForecastItem",
    NULL_CHECK: "should return false for null",
    UNDEFINED_CHECK: "should return false for undefined",
    PRIMITIVE_CHECK: "should return false for a primitive value",
    INVALID_TEMP_CHECK: "should return false if main.temp is not a number",
    MINIMAL_ITEM_CHECK: "should return true even if optional fields are missing",
  },
  TEST_DATA: {
    VALID_ITEM: {
      dt: 1234567890,
      main: {
        temp: 15.5,
        feels_like: 14.2,
        temp_min: 12.0,
        temp_max: 18.0,
        pressure: 1012,
        humidity: 65,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01d",
        },
      ],
      clouds: { all: 0 },
      wind: { speed: 3.1, deg: 120 },
      visibility: 10000,
      pop: 0,
      sys: { pod: "d" },
      dt_txt: "2025-01-01 12:00:00",
    } as ForecastItem,
    INVALID_ITEM: {
      dt: 1234567890,
      main: { temp: "15" },
      dt_txt: "2025-01-01 12:00:00",
    },
    MINIMAL_ITEM: {
      dt: 1234567890,
      main: { temp: 15.5 },
      dt_txt: "2025-01-01 12:00:00",
    },
    PRIMITIVES: {
      NUMBER: 42,
      STRING: "string",
      BOOLEAN: true,
    },
  },
  EXPECTED_RESULTS: {
    TRUE: true,
    FALSE: false,
  },
};
