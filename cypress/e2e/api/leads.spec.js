describe("Leads API", () => {
  const baseUrl = Cypress.env("API_URL");
  let token;

  before(() => {
    // Get auth token first
    cy.request("POST", `${baseUrl}/api/login`, {
      email: "admin@company.com",
      password: "Admin@123",
    }).then((res) => {
      token = res.body.token;
    });
  });

  it("should fetch leads with valid token", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/api/leads`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an("array");
      if (res.body.length > 0) {
        const lead = res.body[0];
        expect(lead).to.have.all.keys(
          "id",
          "name",
          "email",
          "priority",
          "status",
          "isQualified",
          "emailOptIn",
          "notes"
        );
      }
    });
  });

  it("should fail fetching leads without token", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/api/leads`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401);
    });
  });

  it("should fail fetching leads with invalid token", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/api/leads`,
      headers: { Authorization: "Bearer invalid_token" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401);
    });
  });

  it("should create a lead successfully", () => {
    const newLead = {
      name: "Test Lead",
      email: "test.lead@example.com",
      priority: "Medium",
      status: "New",
      isQualified: false,
      emailOptIn: false,
      notes: "Automated test lead",
    };

    cy.request({
      method: "POST",
      url: `${baseUrl}/api/leads`,
      headers: { Authorization: `Bearer ${token}` },
      body: newLead,
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 201]);
      expect(res.body).to.include(newLead);
      expect(res.body).to.have.property("id");
    });
  });

  it("should fail to create a lead with missing fields", () => {
    const invalidLead = { email: "invalid@example.com" };
    cy.request({
      method: "POST",
      url: `${baseUrl}/api/leads`,
      headers: { Authorization: `Bearer ${token}` },
      body: invalidLead,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });

  it("should fail to create a lead without token", () => {
    const lead = { name: "NoToken", email: "notoken@example.com", priority: "Low", status: "New", isQualified: false, emailOptIn: false, notes: "" };
    cy.request({
      method: "POST",
      url: `${baseUrl}/api/leads`,
      body: lead,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401);
    });
  });

  it("should fail to create a lead with invalid token", () => {
    const lead = { name: "InvalidToken", email: "invalidtoken@example.com", priority: "Low", status: "New", isQualified: false, emailOptIn: false, notes: "" };
    cy.request({
      method: "POST",
      url: `${baseUrl}/api/leads`,
      headers: { Authorization: "Bearer invalid_token" },
      body: lead,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401);
    });
  });
});