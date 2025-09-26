import { GEOLOCATION_IS_TURN_ON_MOCK, GEOLOCATION_IS_TURN_ON_TEST } from "@mocks";

const { CURRENT_WEATHER_MOCK, FORECAST_WEATHER_MOCK, CITY_DATA_MOCK } = GEOLOCATION_IS_TURN_ON_MOCK;

const { DESCRIPTION, CONSTANTS } = GEOLOCATION_IS_TURN_ON_TEST;
const { URLS, ALIASES, GEOLOCATION, HTTP } = CONSTANTS;

describe(`${DESCRIPTION}`, () => {
  beforeEach(() => {
    cy.intercept("GET", URLS.WEATHER_API, (req) => {
      expect(req.url).to.include(`lat=${GEOLOCATION.LATITUDE}`);
      expect(req.url).to.include(`lon=${GEOLOCATION.LONGITUDE}`);
      req.reply({
        statusCode: HTTP.STATUS_OK,
        body: CURRENT_WEATHER_MOCK,
      });
    }).as(ALIASES.GET_CURRENT_WEATHER);

    cy.intercept("GET", URLS.FORECAST_API, (req) => {
      expect(req.url).to.include(`lat=${GEOLOCATION.LATITUDE}`);
      expect(req.url).to.include(`lon=${GEOLOCATION.LONGITUDE}`);
      req.reply({
        statusCode: HTTP.STATUS_OK,
        body: FORECAST_WEATHER_MOCK,
      });
    }).as(ALIASES.GET_FORECAST_WEATHER);

    cy.intercept("GET", URLS.REVERSE_GEO_API, (req) => {
      expect(req.url).to.include(`lat=${GEOLOCATION.LATITUDE}`);
      expect(req.url).to.include(`lon=${GEOLOCATION.LONGITUDE}`);
      req.reply({
        statusCode: HTTP.STATUS_OK,
        body: CITY_DATA_MOCK,
      });
    }).as(ALIASES.GET_CITY_BY_COORDS);

    cy.visit(URLS.BASE_URL, {
      onBeforeLoad(win) {
        const mockGeolocation = {
          getCurrentPosition: (successCallback: PositionCallback) => {
            const position: GeolocationPosition = {
              coords: {
                latitude: GEOLOCATION.LATITUDE,
                longitude: GEOLOCATION.LONGITUDE,
                accuracy: GEOLOCATION.ACCURACY,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
                toJSON: function () {
                  throw new Error("Function not implemented.");
                },
              },
              timestamp: Date.now(),
              toJSON: function () {
                throw new Error("Function not implemented.");
              },
            };
            setTimeout(() => successCallback(position), GEOLOCATION.DELAY);
          },
          clearWatch: () => {},
          watchPosition: () => {},
        };

        Object.defineProperty(win.navigator, "geolocation", {
          value: mockGeolocation,
          writable: true,
          configurable: true,
        });
      },
    });
  });
});
