export const MOCK_WEATHER_RESPONSE = [
  {
    name: "Moscow",
    country: "GB",
    lat: 51.5074,
    lon: -0.1278,
    state: "England",
    local_names: {
      en: "London",
      ru: "Лондон",
    },
  },
];

export const MOCK_CURRENT_WEATHER_RESPONSE = {
  coord: {
    lon: -0.1276,
    lat: 51.5073,
  },
  weather: [
    {
      id: 804,
      main: "Clouds",
      description: "пасмурно",
      icon: "04d",
    },
  ],
  base: "stations",
  main: {
    temp: 20.03,
    feels_like: 19.79,
    temp_min: 19.47,
    temp_max: 21.08,
    pressure: 1018,
    humidity: 65,
    sea_level: 1018,
    grnd_level: 1014,
  },
};

export const MOCK_FORECAST_WEATHER = {};

export const WEATHER_SWITCH_TEST = {
  DESCRIPTION: "Test 7",
  IT: {
    DISPLAY_HOURLY_WEATHER: "display hourly weather after search",
  },
  CONSTANTS: {
    URLS: {
      BASE_URL: "http://localhost:4000",
      GEO_DIRECT_API: "**/geo/1.0/direct*",
      CURRENT_WEATHER_API: "**/data/2.5/weather*",
      FORECAST_WEATHER_API: "**/data/2.5/forecast*",
    },
    SELECTORS: {
      INPUT: "input",
      BUTTON: "button",
    },
    HTTP: {
      STATUS_OK: 200,
      METHOD_GET: "GET",
    },
    TEXT: {
      SEARCH: "Search",
      HOURLY: "Hourly",
      DAILY: "Daily",
      MOSCOW: "Moscow",
    },
    QUERY_PARAMS: {
      COUNT: "cnt",
      COUNT_VALUE: "8",
    },
    TIMEOUTS: {
      TIME: 10000,
    },
    ALIASES: {
      GET_CITIES: "getCities",
      GET_CURRENT_WEATHER: "getCurrentWeather",
      GET_FORECAST_WEATHER: "getForecastWeather",
    },
  },
};
