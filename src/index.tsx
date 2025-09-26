import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@components/AppRouter";
import ErrorBoundary from "@components/ErrorBoundary";
import { GlobalStyle } from "@styles/globals";
import { ThemeProvider } from "styled-components";

import { theme } from "./constants/";
import { store } from "./store";

const root = document.getElementById("root");

if (!root) {
  throw new Error("root not found");
}

const container = createRoot(root);

container.render(
  <BrowserRouter>
 
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <AppRoutes />
        </ThemeProvider>
      </Provider>
   
  </BrowserRouter>
);
