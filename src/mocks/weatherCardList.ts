import { TimeOfWeather } from "@constants/index";
import type { FiveDayForecastResponse } from "@types/apiTypes";

import type { RootState } from "@store/index";

export const WEATHER_CARD_GRID_TEST = {
  DESCRIPTION: "WeatherCardGrid Component",
  IT: {
    RENDERS_SPINNER: "renders spinner when no weather data",
    RENDERS_HOURLY_CARDS: "renders WeatherCards for hourly forecast",
    RENDERS_WEEKLY_CARDS: "renders transformed WeatherCards for weekly forecast",
  },
  CONSTANTS: {
    TEST_IDS: {
      SPINNER: "spinner",
      WEATHER_CARD: "weather-card",
    },
    TIME_OF_WEATHER: {
      HOURLY: TimeOfWeather.HOURLY,
      WEEKLY: TimeOfWeather.WEEKLY,
    },
    WEATHER_DATA: {
      cod: "200",
      message: 0,
      cnt: 2,
      list: [
        {
          dt: 1620000000,
          main: {
            temp: 22.5,
            feels_like: 0,
            temp_min: 0,
            temp_max: 0,
            pressure: 0,
            humidity: 0,
          },
          weather: [
            {
              main: "Clear",
              id: 0,
              description: "",
              icon: "",
            },
          ],
          clouds: { all: 0 },
          wind: { speed: 3.2, deg: 180 },
          visibility: 10000,
          pop: 0,
          sys: { pod: "d" },
          dt_txt: "2025-05-03 12:00:00",
        },
      ],
      city: {
        id: 524901,
        name: "Moscow",
        coord: { lat: 55.7558, lon: 37.6176 },
        country: "RU",
        population: 12655050,
        timezone: 10800,
        sunrise: 1619999999,
        sunset: 1620050400,
      },
    } as FiveDayForecastResponse,
  },
  INITIAL_STATE: {
    weatherReducer: {
      loading: false,
      error: null,
      data: null,
      lastRequestType: null,
      timeOfWeather: null,
    },
  } as Partial<RootState>,
  SELECTORS: {
    SELECT_WEATHER: "selectWeather",
  },
};
