import { mount } from "cypress/react";
import "./commands";
Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      setLocalStorage(key: string, value: string): Chainable<void>;
      getReduxStore(): Chainable<any>;
      mockReduxState(state: any): Chainable<void>;
    }
  }
  interface Window {
    FB: any;
  }
  interface Window {
    store?: {
      dispatch: (action: any) => void;
      getState: () => any;
    };
    __REDUX_STORE__?: any;
    __store__?: any;
    initialReduxState?: any;
  }
}

Cypress.Commands.add("mount", mount);

Cypress.Commands.add("setLocalStorage", (key, value) => {
  cy.window().then((win) => {
    win.localStorage.setItem(key, value);
  });
});

Cypress.Commands.add("getReduxStore", () => {
  return cy.window().then((win) => {
    const store = win.Storage || win.__REDUX_STORE__ || win.__store__;
    if (!store) {
      throw new Error("Redux store not found in window object");
    }
    return store;
  });
});

Cypress.Commands.add("mockReduxState", (state) => {
  cy.window().then((win) => {
    win.initialReduxState = state;
  });
});
