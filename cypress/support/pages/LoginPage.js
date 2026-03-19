class LoginPage {
  visit() {
    cy.visit("/login");
  }

  enterEmail(email) {
    if (email) {
      cy.get('input[data-testid="login-email-input"]').clear().type(email);
    }
  }

  enterPassword(password) {
    if (password) {
      cy.get('input[data-testid="login-password-input"]').clear().type(password);
    }
  }

  clickSignIn() {
    cy.get('button[data-testid="login-submit-btn"]').click();
  }

  login(email, password) {
    this.enterEmail(email);
    this.enterPassword(password);
    this.clickSignIn();
  }

 verifyDashboard(role) {
  cy.get('[data-testid="leads-user-role-badge"]')
    .should("be.visible")
    .and("contain.text", role);
  }

  verifyErrorMessage(message) {
    cy.contains(message).should("be.visible");
  }
}

export default new LoginPage();