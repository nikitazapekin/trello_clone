import { GEOLOCATION_DENIED_TEST } from "@mocks";
const { DESCRIPTION, IT, CONSTANTS } = GEOLOCATION_DENIED_TEST;
const { SHOULD_SHOW_GEOLOCATION_TURN_OFF } = IT;
const { URLS, TEST_IDS, GEOLOCATION } = CONSTANTS;

describe(DESCRIPTION, () => {
  beforeEach(() => {
    cy.visit(URLS.BASE_URL);
  });

  it(SHOULD_SHOW_GEOLOCATION_TURN_OFF, () => {
    cy.window().then((win) => {
      const mockGeolocation = {
        getCurrentPosition: (
          successCallback: PositionCallback,
          errorCallback?: PositionErrorCallback
        ) => {
          if (errorCallback) {
            const error: GeolocationPositionError = {
              code: GEOLOCATION.ERROR.CODE,
              message: GEOLOCATION.ERROR.MESSAGE,
              PERMISSION_DENIED: GEOLOCATION.ERROR.PERMISSION_DENIED as 1,
              POSITION_UNAVAILABLE: GEOLOCATION.ERROR.POSITION_UNAVAILABLE as 2,
              TIMEOUT: GEOLOCATION.ERROR.TIMEOUT as 3,
            };
            errorCallback(error);
          }
        },
      };

      Object.defineProperty(win.navigator, "geolocation", {
        value: mockGeolocation,
        writable: true,
      });
    });

    cy.get(`[data-testid="${TEST_IDS.GEOLOCATION_TURN_OFF}"]`).should("exist");
  });
});
