import { SEARCH_WITH_NO_RESULTS, EMPTY_ARRAY_MOCK } from "@mocks";

const { IT, CONSTANTS } = SEARCH_WITH_NO_RESULTS;
const { SHOULD_VALIDATE_API_RESPONSE_STRUCTURE } = IT;

const { URLS, TEST_IDS, SELECTORS, HTTP, TEXT, ALIASES } = CONSTANTS;
const { GET_CITIES } = ALIASES;
const { BASE_URL, GEO_DIRECT_API } = URLS;
const { SPINNER, NO_SUGGESTIONS } = TEST_IDS;
const { TEST_INPUT } = TEXT;
const { STATUS_OK, METHOD_GET } = HTTP;
const { INPUT } = SELECTORS;

describe(`${SEARCH_WITH_NO_RESULTS}`, () => {
  beforeEach(() => {
    cy.intercept("GET", GEO_DIRECT_API, (req) => {
      req.reply({
        statusCode: STATUS_OK,
        body: EMPTY_ARRAY_MOCK,
      });
    }).as(`${GET_CITIES}`);

    cy.visit(BASE_URL);
  });

  it(`${SHOULD_VALIDATE_API_RESPONSE_STRUCTURE}`, () => {
    cy.get(INPUT).type(TEST_INPUT);
    cy.get(`[data-testid=${SPINNER}]`).should("exist");
    cy.wait(`@${GET_CITIES}`).then((interception) => {
      expect(interception.request.url).to.include("/geo/1.0/direct");
      expect(interception.request.method).to.equal(METHOD_GET);

      const response = interception.response?.body;
      expect(response).to.be.an("array");
    });

    cy.get(`[data-testid=${SPINNER}]`).should("not.exist");
    cy.get(`[data-testid=${NO_SUGGESTIONS}]`).should("exist");
  });
});
