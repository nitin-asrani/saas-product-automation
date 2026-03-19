const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin =
  require("@badeball/cypress-cucumber-preprocessor/esbuild").default;

require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    specPattern: ["cypress/e2e/**/*.feature", "cypress/e2e/api/**/*.spec.js"],
    baseUrl: process.env.CYPRESS_baseUrl,
    env: {
      API_URL: process.env.API_URL,
    },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      return config;
    },
  },
});