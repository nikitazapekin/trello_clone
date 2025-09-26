import type { FiveDayForecastResponse, ForecastItem } from "@types/apiTypes";

export const TRANSFORM_WEATHER_MOCK = {
  forecastItem: (dt: number, temp: number, main: string, description: string): ForecastItem => ({
    dt,
    main: {
      temp,
      feels_like: 0,
      temp_min: 0,
      temp_max: 0,
      pressure: 0,
      humidity: 0,
    },
    weather: [
      {
        id: 0,
        main,
        description,
        icon: "",
      },
    ],
    clouds: { all: 0 },
    wind: { speed: 0, deg: 0 },
    visibility: 0,
    pop: 0,
    sys: { pod: "" },
    dt_txt: "2025-01-01T11:00:00",
  }),
  baseResponse: (list: ForecastItem[]): FiveDayForecastResponse => ({
    cod: "200",
    message: 0,
    cnt: 0,
    list,
    city: WEATHER_TRANSFORM_TEST.TEST_DATA.EMPTY_CITY,
  }),
};

export const WEATHER_TRANSFORM_TEST = {
  DESCRIPTION: "transformWeatherData",
  TEST_DATA: {
    DATES: {
      DAY1: "2025-01-01T12:00:00",
      DAY1_ALT: "2025-01-01T15:00:00",
      DAY2: "2025-01-02T12:00:00",
    },
    WEATHER_CONDITIONS: {
      CLOUDS: { main: "Clouds", description: "cloudy" },
      RAIN: { main: "Rain", description: "rainy" },
      CLEAR: { main: "Clear", description: "sunny" },
      FOG: { main: "Fog", description: "foggy" },
      RUSSIAN: {
        RAIN: { main: "Rain", description: "дождь" },
        CLEAR: { main: "Clear", description: "ясно" },
        CLOUDS: { main: "Clouds", description: "пасмурно" },
        FOG: { main: "Fog", description: "туман" },
      },
    },
    TEMPERATURES: {
      LOW: 10,
      HIGH: 20,
      MID: 15,
    },
    PROBABILITIES: {
      SINGLE: 0.25,
      DOUBLE: 0.5,
    },
    EMPTY_CITY: {
      id: 0,
      name: "",
      coord: { lat: 0, lon: 0 },
      country: "",
      population: 0,
      timezone: 0,
      sunrise: 0,
      sunset: 0,
    },
  },
  IT: {
    SHOULD_GROUP_FORECAST_BY_DAY: "should group forecasts by day and calculate average temperature",
    SHOULD_CALCULATE_WEATHER_CONDITIONS:
      "should correctly calculate weather condition probabilities",
    SHOULD_HANDLE_MULTIPLE_LANGUAGES: "should handle multiple language weather descriptions",
    SHOULD_HANDLE_EMPTY_LIST: "should handle empty forecast list",
    SHOULD_HANDLE_WEATHER_CONDITIONS: "should correctly handle mixed weather conditions",
  },
};
