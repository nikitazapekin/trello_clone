import { DISPLAY_OF_ELEMENTS_CONSTANTS } from "@mocks";

const { DESCRIPTION, IT, CONSTANTS } = DISPLAY_OF_ELEMENTS_CONSTANTS;
const {
  SHOULD_HAVE_BANNER,
  SHOULD_HAVE_SEARCH_INPUT,
  SHOULD_HAVE_ROOT_URL,
  SHOULD_HAVE_SIGN_IN_BUTTON,
  SHOULD_HAVE_DAILY_FORECAST_BUTTON,
  SHOULD_HAVE_HOURLY_FORECAST_BUTTON,
} = IT;
const { TEST_IDS, SELECTORS, TEXT, URL } = CONSTANTS;

describe(`${DESCRIPTION}`, () => {
  beforeEach(() => {
    cy.visit(URL);
  });

  it(`${SHOULD_HAVE_BANNER}`, () => {
    cy.get(`[data-testid="${TEST_IDS.BANNER}"]`).should("exist");
  });

  it(`${SHOULD_HAVE_SEARCH_INPUT}`, () => {
    cy.get(SELECTORS.INPUT).should("have.length", 1);
  });

  it(`${SHOULD_HAVE_ROOT_URL}`, () => {
    cy.url().should("include", SELECTORS.URL);
  });

  it(`${SHOULD_HAVE_SIGN_IN_BUTTON}`, () => {
    cy.contains(SELECTORS.BUTTON, TEXT.SIGN_IN).should("exist");
  });

  it(`${SHOULD_HAVE_DAILY_FORECAST_BUTTON}`, () => {
    cy.contains(SELECTORS.BUTTON, TEXT.DAILY).should("exist");
  });

  it(`${SHOULD_HAVE_HOURLY_FORECAST_BUTTON}`, () => {
    cy.contains(SELECTORS.BUTTON, TEXT.HOURLY).should("exist");
  });
});
