import type { FiveDayForecastResponse } from "@types/apiTypes";

export const SWIPER_MOCKS = {
  WEATHER_DATA: {
    cod: "200",
    message: 0,
    cnt: 2,
    list: [
      {
        dt: 1620000000,
        main: {
          temp: 22.5,
          feels_like: 21.3,
          temp_min: 20.1,
          temp_max: 24.8,
          pressure: 1012,
          humidity: 65,
        },
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "ясно",
            icon: "01d",
          },
        ],
        clouds: { all: 0 },
        wind: { speed: 3.2, deg: 180 },
        visibility: 10000,
        pop: 0,
        sys: { pod: "d" },
        dt_txt: "2025-05-03 12:00:00",
      },
      {
        dt: 1620010800,
        main: {
          temp: 18.7,
          feels_like: 17.2,
          temp_min: 17.5,
          temp_max: 20.1,
          pressure: 1013,
          humidity: 70,
        },
        weather: [
          {
            id: 500,
            main: "Rain",
            description: "легкий дождь",
            icon: "10n",
          },
        ],
        clouds: { all: 75 },
        wind: { speed: 2.1, deg: 210 },
        visibility: 8000,
        pop: 0.4,
        sys: { pod: "n" },
        dt_txt: "2025-05-03 15:00:00",
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
};
