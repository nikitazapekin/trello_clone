import { NOT_FOUND_TEST_MOCK } from "@mocks";
const { DESCRIPTION, IT, CONSTANTS } = NOT_FOUND_TEST_MOCK;
const { SHOULD_NAVIGATE_TO_NOT_FOUND } = IT;
const { URLS, TEST_IDS, TEXT } = CONSTANTS;

describe(`${DESCRIPTION}`, () => {
  it(`${SHOULD_NAVIGATE_TO_NOT_FOUND}`, () => {
    cy.visit(`${URLS.BASE_URL}${URLS.INVALID_PATH}`);

    cy.get(`[data-testid="${TEST_IDS.NOT_FOUND_PAGE}"]`).should("exist");

    cy.contains(TEXT.PAGE_NOT_FOUND).should("be.visible");

    cy.url().should("include", URLS.INVALID_PATH);
  });
});
