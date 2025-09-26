import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { APP_ROUTER_TEST } from "@mocks";
import { render, screen } from "@testing-library/react";

import AppRoutes from ".";

const { DESCRIPTION, IT, CONSTANTS } = APP_ROUTER_TEST;
const {
  SHOULD_RENDER_WEATHER_PAGE,
  SHOULD_RENDER_NOT_FOUND_PAGE_FOR_UNKNOWN_ROUTE,
  SHOULD_RENDER_NOT_FOUND_PAGE_FOR_404,
} = IT;
const { MAIN_PAGE, TEST_ID, BUTTON_NAME, UNKNOWN_ROUTE, NOT_FOUND_PAGE } = CONSTANTS;

jest.mock("@pages/WeatherPage", () => () => (
  <div data-testid={TEST_ID.WEATHER_PAGE}>
    <h1>Weather Page</h1>
    <button>{BUTTON_NAME}</button>
  </div>
));

jest.mock("@pages/NotFoundPage", () => () => (
  <div data-testid={TEST_ID.NOT_FOUND_PAGE}>
    <h1>Page Not Found</h1>
    <p>The page you have reached does not exist</p>
  </div>
));

describe(`${DESCRIPTION}`, () => {
  const setupRouterTest = (initialRoute = MAIN_PAGE) => {
    const router = createMemoryRouter(
      [
        {
          path: "/*",
          element: <AppRoutes />,
        },
      ],
      {
        initialEntries: [initialRoute],
      }
    );

    render(<RouterProvider router={router} />);

    return { router };
  };

  it(`${SHOULD_RENDER_WEATHER_PAGE}`, async () => {
    setupRouterTest(MAIN_PAGE);
    expect(await screen.findByTestId(TEST_ID.WEATHER_PAGE)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: BUTTON_NAME })).toBeInTheDocument();
  });

  it(`${SHOULD_RENDER_NOT_FOUND_PAGE_FOR_UNKNOWN_ROUTE}`, async () => {
    setupRouterTest(UNKNOWN_ROUTE);
    expect(await screen.findByTestId(TEST_ID.NOT_FOUND_PAGE)).toBeInTheDocument();
  });

  it(`${SHOULD_RENDER_NOT_FOUND_PAGE_FOR_404}`, async () => {
    setupRouterTest(NOT_FOUND_PAGE);
    expect(await screen.findByTestId(TEST_ID.NOT_FOUND_PAGE)).toBeInTheDocument();
  });
});
