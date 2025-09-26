export const GEOLOCATION_IS_TURN_ON_MOCK = {
  CURRENT_WEATHER_MOCK: {
    coord: {
      lon: 37.6173,
      lat: 55.7558,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "ясно",
        icon: "01d",
      },
    ],
    main: {
      temp: 20.5,
      feels_like: 20.2,
      temp_min: 18.0,
      temp_max: 22.0,
      pressure: 1015,
      humidity: 60,
    },
    name: "Moscow",
  },

  FORECAST_WEATHER_MOCK: {
    list: [
      {
        dt: Date.now(),
        main: { temp: 20.5 },
        weather: [{ icon: "01d" }],
      },
    ],
  },

  CITY_DATA_MOCK: [
    {
      name: "Moscow",
      country: "RU",
      lat: 55.7558,
      lon: 37.6173,
      state: "Moscow",
    },
  ],
};

export const GEOLOCATION_IS_TURN_ON_TEST = {
  DESCRIPTION: "Test 5 - User approved geolocation",
  CONSTANTS: {
    URLS: {
      BASE_URL: "http://localhost:4000",
      WEATHER_API: "**/data/2.5/weather*",
      FORECAST_API: "**/data/2.5/forecast*",
      REVERSE_GEO_API: "**/geo/1.0/reverse*",
    },
    ALIASES: {
      GET_CURRENT_WEATHER: "getCurrentWeatherByCoords",
      GET_FORECAST_WEATHER: "getForecastWeatherByCoords",
      GET_CITY_BY_COORDS: "getCityByCoords",
    },
    GEOLOCATION: {
      LATITUDE: 55.7558,
      LONGITUDE: 37.6173,
      ACCURACY: 10,
      DELAY: 100,
    },
    HTTP: {
      STATUS_OK: 200,
    },
    MOCK_DATA: {
      CURRENT_WEATHER: "CURRENT_WEATHER_MOCK",
      FORECAST_WEATHER: "FORECAST_WEATHER_MOCK",
      CITY_DATA: "CITY_DATA_MOCK",
    },
  },
};
