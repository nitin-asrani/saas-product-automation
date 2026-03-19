import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../pages/LoginPage";

Given("the user is on the login page", () => {
  LoginPage.visit();
});

When("the user enters email {string}", (email) => {
  LoginPage.enterEmail(email);
});

When("the user enters password {string}", (password) => {
  LoginPage.enterPassword(password);
});

When("the user leaves the email field empty", () => {
 
});

When("the user leaves the password field empty", () => {
  
});

When("the user clicks the {string} button", () => {
  LoginPage.clickSignIn();
});

Then("the user should be logged in successfully", () => {
  cy.url().should("not.include", "/login");
});

Then("the login should fail", () => {
  cy.url().should("include", "/login");
});

Then("the user should see the {string}", (dashboard) => {
  LoginPage.verifyDashboard(dashboard);
});

Then("the user should have {string} permissions", (permissionType) => {

  const selectors = {
    create: '[data-testid="leads-create-new-btn"]',
    export: '[data-testid="leads-export-btn"]',
    view: '[data-testid^="lead-view-btn-"]',
    edit: '[data-testid^="lead-edit-btn-"]',
    delete: '[data-testid^="lead-delete-btn-"]',
  };

  if (permissionType === "full access") {
    cy.get(selectors.create).should("be.visible");
    cy.get(selectors.export).should("be.visible");
    cy.get(selectors.view).should("exist");
    cy.get(selectors.edit).should("exist");
    cy.get(selectors.delete).should("exist");

  } else if (permissionType === "limited access") {
    cy.get(selectors.create).should("be.visible");
    cy.get(selectors.export).should("be.visible");
    cy.get(selectors.view).should("exist");
    cy.get(selectors.edit).should("exist");
    cy.get(selectors.delete).should("not.exist");

  } else if (permissionType === "read-only") {
    cy.get(selectors.view).should("exist");

    cy.get(selectors.create).should("not.exist");
    cy.get(selectors.edit).should("not.exist");
    cy.get(selectors.delete).should("not.exist");
    cy.get(selectors.export).should("not.exist");
  }
});

Then("the user should see the error message {string}", (message) => {
  LoginPage.verifyErrorMessage(message);
});