import { MOCK_CURRENT_WEATHER, MOCK_RESPONSE, SEARCH_TEST_CONSTANTS } from "@mocks";

const { DESCRIPTION, IT, CONSTANTS } = SEARCH_TEST_CONSTANTS;
const {
  SHOULD_PASS_CORRECT_PARAMETERS,
  SHOULD_DISPLAY_SUGGESTIONS,
  SHOULD_RENDER_INPUT_AND_BUTTON,
  SHOULD_VALIDATE_API_RESPONSE,
  SHOULD_SELECT_SUGGESTION,
  SHOULD_RECEIVE_WEATHER,
  SHOULD_RECEIVE_WEATHER_ON_SEARCH,
} = IT;
const { URLS, TEST_IDS, SELECTORS, HTTP, TEXT, QUERY_PARAMS, VALIDATION, ALIASES } = CONSTANTS;
const { BASE_URL, GEO_DIRECT_API, WEATHER_API } = URLS;
const { SUGGESTIONS_WRAPPER } = TEST_IDS;
const { STATUS_OK } = HTTP;
const { INPUT, BUTTON, LIST_ITEM } = SELECTORS;
const { SEARCH, LONDON, LON, MINSK, SELECTED_SUGGESTION } = TEXT;
const { QUERY, LIMIT, LIMIT_VALUE } = QUERY_PARAMS;
const { TIMEOUT, LAT_RANGE, LON_RANGE, RESPONSE_KEYS } = VALIDATION;
const { GET_CITIES, GET_CURRENT_WEATHER } = ALIASES;

describe(`${DESCRIPTION}`, () => {
  beforeEach(() => {
    cy.intercept("GET", GEO_DIRECT_API, { statusCode: STATUS_OK, body: MOCK_RESPONSE }).as(
      GET_CITIES
    );

    cy.intercept("GET", WEATHER_API, (req) => {
      req.reply({
        statusCode: STATUS_OK,
        body: MOCK_CURRENT_WEATHER,
      });
    }).as(GET_CURRENT_WEATHER);

    cy.visit(BASE_URL);
  });

  it(`${SHOULD_PASS_CORRECT_PARAMETERS}`, () => {
    cy.get(INPUT).type(LONDON);

    cy.wait(`@${GET_CITIES}`).then((interception) => {
      expect(interception.request.url).to.include(`${QUERY}=${LONDON}`);
      expect(interception.request.url).to.include(`${LIMIT}=${LIMIT_VALUE}`);
    });
  });

  it(`${SHOULD_DISPLAY_SUGGESTIONS}`, () => {
    cy.get(INPUT).type(LON);
    cy.get(`[data-testid=${SUGGESTIONS_WRAPPER}]`).should("be.visible");
    cy.get(LIST_ITEM).should("have.length.gt", 0);
  });

  it(`${SHOULD_RENDER_INPUT_AND_BUTTON}`, () => {
    cy.get(INPUT).should("exist");
    cy.get(BUTTON).should("contain", SEARCH);
  });

  it(`${SHOULD_VALIDATE_API_RESPONSE}`, () => {
    cy.get(INPUT).type(MINSK);

    cy.get(`[data-testid=${SUGGESTIONS_WRAPPER}]`).should("be.visible");

    cy.wait(`@${GET_CITIES}`, { timeout: TIMEOUT }).then((interception) => {
      expect(interception.response?.body).to.exist;
      const response = interception.response?.body;

      expect(response).to.be.an("array");
      expect(response[0]).to.have.all.keys(RESPONSE_KEYS);

      expect(response[0].name).to.be.a("string");
      expect(response[0].country).to.be.a("string");
      expect(response[0].lat).to.be.a("number");
      expect(response[0].lon).to.be.a("number");
      expect(response[0].state).to.be.a("string");
      expect(response[0].local_names).to.be.an("object");

      if (response[0].local_names) {
        expect(response[0].local_names.en).to.be.a("string");
        expect(response[0].local_names.ru).to.be.a("string");
      }
      expect(response[0].lat).to.be.within(LAT_RANGE.MIN, LAT_RANGE.MAX);
      expect(response[0].lon).to.be.within(LON_RANGE.MIN, LON_RANGE.MAX);
    });

    cy.get(`[data-testid=${SUGGESTIONS_WRAPPER}]`).should("exist");
  });

  it(`${SHOULD_SELECT_SUGGESTION}`, () => {
    cy.get(INPUT).type(LON);
    cy.get(LIST_ITEM).first().click();
    cy.get(INPUT).should("have.value", `${SELECTED_SUGGESTION}`);
  });

  it(`${SHOULD_RECEIVE_WEATHER}`, () => {
    cy.get(INPUT).type(LON);
    cy.get(`[data-testid=${SUGGESTIONS_WRAPPER}]`).should("be.visible");
    cy.get(LIST_ITEM).should("have.length.gt", 0);
  });

  it(`${SHOULD_RECEIVE_WEATHER_ON_SEARCH}`, () => {
    cy.get(INPUT).type(LONDON);
    cy.get(`[data-testid=${SUGGESTIONS_WRAPPER}]`).should("exist");

    cy.get(BUTTON).contains(SEARCH).click();

    cy.wait(`@${GET_CURRENT_WEATHER}`).then((interception) => {
      expect(interception.response?.body).to.exist;
    });
  });
});
