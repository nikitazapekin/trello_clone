export const BOTTOM_OF_THE_BANNER_MOCK = {
  WEATHER_DATA: {
    coord: { lon: 30, lat: 59 },
    weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
    main: { temp: 20, feels_like: 19, temp_min: 18, temp_max: 22, pressure: 1012, humidity: 50 },
    visibility: 10000,
    wind: { speed: 3, deg: 180 },
    clouds: { all: 0 },
    dt: 162,
    sys: { country: "RU", sunrise: 162, sunset: 162 },
    timezone: 108,
    id: 498817,
    name: "Saint Petersburg",
    cod: 200,
  },

  RESIZE: {
    DESKTOP: { isMobileView: false },
    MOBILE: { isMobileView: true },
  },
};

export const BOTTOM_BANNER_TEST = {
  DESCRIPTION: "BottomOfTheBanner Component",
  IT: {
    RENDERS_SPINNER: "renders spinner when loading",
    RETURNS_NULL: "returns null when no coordinates and geolocation not denied",
    RENDERS_GEOLOCATION_OFF: "renders GeolocationIsTurnOff when geolocation denied and no search",
    RENDERS_DESKTOP_VIEW: "renders TodayWeather and Swiper in desktop view with weather data",
    RENDERS_MOBILE_VIEW:
      "renders TodayWeather and WeatherCardGrid in mobile view with weather data",
  },
  CONSTANTS: {
    TEST_IDS: {
      SPINNER: "spinner",
    },
    TEXT: {
      GEOLOCATION_OFF: "Geolocation is turned off",
      TODAY_WEATHER: "TodayWeather",
      SWIPER: "Swiper",
      WEATHER_CARD_GRID: "WeatherCardGrid",
    },
  },

  SELECTORS: {
    SELECT_WEATHER: "selectWeather",
    SELECT_CURRENT_COORDINATS: "selectCurrentCoordinats",
    SELECT_CITIES_SUGGESTIONS: "selectCitiesSuggestions",
  },
};
