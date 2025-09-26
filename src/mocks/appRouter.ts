export const APP_ROUTER_TEST = {
  DESCRIPTION: "AppRouter",
  IT: {
    SHOULD_RENDER_WEATHER_PAGE: "should render WeatherPage for main route",
    SHOULD_RENDER_NOT_FOUND_PAGE_FOR_UNKNOWN_ROUTE: "should render NotFoundPage for unknown route",
    SHOULD_RENDER_NOT_FOUND_PAGE_FOR_404: "should render NotFoundPage for /404 route",
  },
  CONSTANTS: {
    MAIN_PAGE: "/",
    TEST_ID: {
      WEATHER_PAGE: "weather-page",
      NOT_FOUND_PAGE: "not-found-page",
    },
    BUTTON_NAME: "Search",
    UNKNOWN_ROUTE: "/unknown-route",
    NOT_FOUND_PAGE: "/404",
  },
};
