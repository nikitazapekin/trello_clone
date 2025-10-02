import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@components/AppRouter";
import { GlobalStyle } from "@styles/globals";
import { ThemeProvider } from "styled-components";

import { theme } from "./constants/";
 

const root = document.getElementById("root");

if (!root) {
  throw new Error("root not found");
}

const container = createRoot(root);

container.render(
  <BrowserRouter>
  
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <AppRoutes />
        </ThemeProvider>
 
   
  </BrowserRouter>
);
