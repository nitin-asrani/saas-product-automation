describe("Login API", () => {
  const baseUrl = Cypress.env("API_URL");

  it("should login successfully with valid credentials", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/api/login`,
      body: {
        email: "admin@company.com",
        password: "Admin@123",
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.token).to.be.a("string").and.not.be.empty;
      expect(res.body.email).to.eq("admin@company.com");

      // Save token for later tests
      Cypress.env("authToken", res.body.token);
    });
  });

  it("should fail login with wrong password", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/api/login`,
      body: { email: "admin@company.com", password: "WrongPassword" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 401]);
      expect(res.body.success).to.be.false;
    });
  });

  it("should fail login with nonexistent email", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/api/login`,
      body: { email: "nonexistent@company.com", password: "Admin@123" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 401]);
      expect(res.body.success).to.be.false;
    });
  });

  it("should fail login if fields are missing", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/api/login`,
      body: { email: "admin@company.com" }, // missing password
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.success).to.be.false;
    });
  });
});