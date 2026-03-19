// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Login (FAST - API based recommended)
Cypress.Commands.add("login", () => {
  cy.request("POST", "/api/login", {
    email: "admin@company.com",
    password: "Admin@123",
  }).then((resp) => {
    window.localStorage.setItem("token", resp.body.token);
  });
});

// Reusable search
Cypress.Commands.add("searchLead", (text) => {
  cy.get('[data-testid="leads-search-input"]').clear().type(text);
});

// Reusable validation
Cypress.Commands.add("verifyLeadsContain", (text) => {
  cy.get('[data-testid^="lead-row-"]').each(($row) => {
    cy.wrap($row).should("contain.text", text);
  });
});