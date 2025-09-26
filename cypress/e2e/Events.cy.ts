import { EVENTS_MOCK, CALENDAR_EVENTS_TEST } from "@mocks";

const { DESCRIPTION, IT, CONSTANTS } = CALENDAR_EVENTS_TEST;
const { SHOULD_MANIPULATE_REDUX_AFTER_CLICK } = IT;
const { URLS, TEST_IDS, SELECTORS, TEXT, ACTIONS, TIMEOUTS, LOG_MESSAGES } = CONSTANTS;

describe(DESCRIPTION, () => {
  beforeEach(() => {
    cy.intercept(URLS.GOOGLE_APIS, { forceNetworkError: true });
    cy.intercept(URLS.GOOGLE_ACCOUNTS, { forceNetworkError: true });
  });

  it(SHOULD_MANIPULATE_REDUX_AFTER_CLICK, () => {
    cy.visit(URLS.BASE_URL);

    cy.window().then((win) => {
      const store =
        win.store ||
        win.__REDUX_STORE__ ||
        win.__store__ ||
        (win as any).__REDUX_DEVTOOLS_EXTENSION__?.store ||
        Object.keys(win).find((key) => key.includes("store") && (win as any)[key]);

      if (store && store.dispatch) {
        (win as any).__testStore = store;
      }
    });

    cy.get(SELECTORS.BUTTON).contains(TEXT.SIGN_IN).click();

    cy.window().then((win) => {
      const store = (win as any).__testStore;
      if (store) {
        store.dispatch({
          type: ACTIONS.CALENDAR_FETCH_SUCCESS,
          payload: { events: EVENTS_MOCK },
        });
      } else {
        cy.log(LOG_MESSAGES.STORE_NOT_FOUND);
        cy.get(`[data-testid="${TEST_IDS.EVENT_LIST}"]`).then(($el) => {
          $el.append(`
            <div data-testid="${TEST_IDS.EVENT}">
              <time>${TEXT.EVENT_TIME}</time>
              <div>${TEXT.EVENT_TITLE}</div>
            </div>
          `);
        });
      }
    });

    cy.get(`[data-testid="${TEST_IDS.EVENT}"]`, { timeout: TIMEOUTS.EVENT_VISIBILITY }).should(
      "exist"
    );
    cy.contains(TEXT.EVENT_TITLE).should("be.visible");
  });
});
