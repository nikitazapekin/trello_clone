import {
  MOCK_WEATHER_RESPONSE,
  MOCK_CURRENT_WEATHER_RESPONSE,
  MOCK_FORECAST_WEATHER,
  WEATHER_SWITCH_TEST,
} from "@mocks/switchTypeOfWeather";

const { DESCRIPTION, IT, CONSTANTS } = WEATHER_SWITCH_TEST;
const { DISPLAY_HOURLY_WEATHER } = IT;
const { URLS, SELECTORS, HTTP, TEXT, QUERY_PARAMS, TIMEOUTS, ALIASES } = CONSTANTS;

const { BASE_URL, GEO_DIRECT_API, CURRENT_WEATHER_API, FORECAST_WEATHER_API } = URLS;
const { INPUT, BUTTON } = SELECTORS;
const { STATUS_OK } = HTTP;
const { SEARCH, HOURLY, DAILY, MOSCOW } = TEXT;
const { COUNT, COUNT_VALUE } = QUERY_PARAMS;
const { TIME } = TIMEOUTS;
const { GET_CITIES, GET_CURRENT_WEATHER, GET_FORECAST_WEATHER } = ALIASES;

describe(`${DESCRIPTION}`, () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    cy.intercept("GET", GEO_DIRECT_API, { statusCode: STATUS_OK, body: MOCK_WEATHER_RESPONSE }).as(
      GET_CITIES
    );

    cy.intercept("GET", CURRENT_WEATHER_API, (req) => {
      req.reply({
        statusCode: STATUS_OK,
        body: MOCK_CURRENT_WEATHER_RESPONSE,
      });
    }).as(`${GET_CURRENT_WEATHER}`);

    cy.intercept("GET", FORECAST_WEATHER_API, (req) => {
      if (req.url.includes(`${COUNT}=${COUNT_VALUE}`)) {
        expect(req.url).to.include(`${COUNT}=${COUNT_VALUE}`);
      }
      req.reply({
        statusCode: STATUS_OK,
        body: MOCK_FORECAST_WEATHER,
      });
    }).as(`${GET_FORECAST_WEATHER}`);

    cy.visit(BASE_URL);
  });

  it(`${DISPLAY_HOURLY_WEATHER}`, () => {
    cy.get(INPUT, { timeout: TIME }).type(MOSCOW);
    cy.wait(`@${GET_CITIES}`);

    cy.get(BUTTON).contains(SEARCH).click();
    cy.wait(`@${GET_CURRENT_WEATHER}`).then((interception) => {
      expect(interception.response?.body).to.exist;
    });

    cy.wait(`@${GET_FORECAST_WEATHER}`).then((interception) => {
      expect(interception.request.url).not.to.include(`${COUNT}=${COUNT_VALUE}`);
    });

    cy.get(BUTTON).contains(HOURLY).click();
    cy.wait(`@${GET_FORECAST_WEATHER}`).then((interception) => {
      expect(interception.request.url).to.include(`${COUNT}=${COUNT_VALUE}`);
      expect(interception.response?.body).to.exist;
    });

    cy.clearLocalStorage();
    cy.get(BUTTON).contains(DAILY).click();
    cy.wait(`@${GET_FORECAST_WEATHER}`).then((interception) => {
      expect(interception.request.url).not.to.include(`${COUNT}=${COUNT_VALUE}`);
    });
  });
});
