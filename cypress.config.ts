import { defineConfig } from "cypress";

export default defineConfig({
  video: true,
  port: 4001,
  chromeWebSecurity: false,

  env: {},
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
    indexHtmlFile: "cypress/support/component-index.html",
  },

  e2e: {
    baseUrl: "http://localhost:4000",
    setupNodeEvents(on, config) {},
    testIsolation: false,
  },
});
