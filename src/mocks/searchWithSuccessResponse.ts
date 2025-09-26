export const MOCK_RESPONSE = [
  {
    name: "London",
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

export const MOCK_CURRENT_WEATHER = {
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

export const SEARCH_TEST_CONSTANTS = {
  DESCRIPTION: "Test 2",
  IT: {
    SHOULD_PASS_CORRECT_PARAMETERS: "should pass correct parameters to API",
    SHOULD_DISPLAY_SUGGESTIONS: "should display suggestions when typing",
    SHOULD_RENDER_INPUT_AND_BUTTON: "should render search input and button",
    SHOULD_VALIDATE_API_RESPONSE: "should validate API response structure matches mock data",
    SHOULD_SELECT_SUGGESTION: "should select a suggestion when clicked",
    SHOULD_RECEIVE_WEATHER: "should display weather data when suggestions are available",
    SHOULD_RECEIVE_WEATHER_ON_SEARCH: "should receive weather after click on search button", //
  },
  CONSTANTS: {
    URLS: {
      BASE_URL: "http://localhost:4000",
      GEO_DIRECT_API: "**/geo/1.0/direct*",
      WEATHER_API: "**/data/2.5/weather*",
    },
    TEST_IDS: {
      SUGGESTIONS_WRAPPER: "suggestions-wrapper",
    },
    SELECTORS: {
      INPUT: "input",
      BUTTON: "button",
      LIST_ITEM: "li",
    },
    HTTP: {
      STATUS_OK: 200,
      METHOD_GET: "GET",
    },
    TEXT: {
      SEARCH: "Search",
      LONDON: "London",
      LON: "Lon",
      MINSK: "Minsk",
      SELECTED_SUGGESTION: "London, England, GB",
    },
    QUERY_PARAMS: {
      QUERY: "q",
      LIMIT: "limit",
      LIMIT_VALUE: "5",
    },
    VALIDATION: {
      TIMEOUT: 10000,
      LAT_RANGE: { MIN: -90, MAX: 90 },
      LON_RANGE: { MIN: -180, MAX: 180 },
      RESPONSE_KEYS: ["name", "country", "lat", "lon", "state", "local_names"],
      LOCAL_NAMES_KEYS: ["en", "ru"],
    },
    ALIASES: {
      GET_CITIES: "getCities",
      GET_CURRENT_WEATHER: "getCurrentWeather",
    },
  },
};
