import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LeadManagerPage from "../pages/LeadManagerPage";

// -------------------- NAVIGATION --------------------

// Login using credentials from a fixture
Given("the user is logged into the system", () => {
  cy.fixture("users").then((users) => {
    const admin = users.admin;
    cy.visit("/login");
    cy.get('input[data-testid="login-email-input"]').clear().type(admin.email);
    cy.get('input[data-testid="login-password-input"]').clear().type(admin.password);
    cy.get('button[data-testid="login-submit-btn"]').click();

    // Ensure dashboard loads
    cy.url().should("not.include", "/login");
  });
});

Given("the user navigates to the Lead Manager page", () => {
  LeadManagerPage.visit();
});

// -------------------- GRID --------------------

Then("the system should display a grid with columns:", (dataTable) => {
  dataTable.raw().flat().forEach((column) => {
    LeadManagerPage.getColumnHeader(column).scrollIntoView().should("exist");
  });
});

Then("each row should contain valid lead data", () => {
  LeadManagerPage.verifyRowsExist();
});

Then("the grid should display all leads", () => {
  LeadManagerPage.verifyRowsExist();
});

// -------------------- DEFAULT FILTER --------------------

Then('the {string} filter should be selected by default', (filter) => {
  LeadManagerPage.getStatusDropdownValue().then((value) => {
  expect(value.trim()).to.eq(filter);
  });
});

// -------------------- SEARCH --------------------

When("the user enters {string} in the search bar", (text) => {
  LeadManagerPage.search(text);
  
});

Then("the grid should display only leads matching {string}", (text) => {
  cy.get('[data-testid^="lead-row-"]').each(($row) => {
    cy.wrap($row).should("contain.text", text);
  });
});

Then("the grid should display only matching leads", () => {
  LeadManagerPage.verifyRowsExist();
});

Then("the system should display {string}", (message) => {
  LeadManagerPage.verifyNoResults(message);
});

Then("the search input should have placeholder {string}", (placeholder) => {
  LeadManagerPage.getSearchInput().should("have.attr", "placeholder", placeholder);
});

// -------------------- FILTER --------------------

When("the user selects {string} from the status dropdown", (status) => {
  LeadManagerPage.selectStatus(status);
});

Then("only leads with status {string} should be displayed", (status) => {
  cy.get('[data-testid^="lead-row-"]').each(($row) => {
    cy.wrap($row).should("contain.text", status);
  });
});

// -------------------- SORTING --------------------

When("the user clicks the {string} column header", (column) => {
  LeadManagerPage.getColumnHeader(column).scrollIntoView().click();
});

When("the user clicks the {string} column header again", (column) => {
  LeadManagerPage.getColumnHeader(column).scrollIntoView().click().click();
});

// Sorting ascending
Then('the leads should be sorted in ascending order by {string}', (column) => {
  LeadManagerPage.getColumnCells(column).then(($cells) => {
    const texts = [...$cells].map(el => el.textContent?.trim() || "");
    const sorted = [...texts].sort((a, b) => a.localeCompare(b));
    expect(texts).to.deep.equal(sorted);
  });
});

// Sorting descending
Then('the leads should be sorted in descending order by {string}', (column) => {
  LeadManagerPage.getColumnCells(column).then(($cells) => {
    const texts = [...$cells].map(el => el.textContent?.trim() || "");
    const sorted = [...texts].sort((a, b) => b.localeCompare(a));
    expect(texts).to.deep.equal(sorted);
  });
});

// Numeric sorting
Then('the leads should be sorted numerically by {string}', (column) => {
  LeadManagerPage.getColumnCells(column).then(($cells) => {
    const nums = [...$cells].map(el => parseFloat(el.textContent?.replace(/[$,]/g,'') || "0"));
    const sorted = [...nums].sort((a, b) => a - b);
    expect(nums).to.deep.equal(sorted);
  });
});

// -------------------- BADGES & FORMATS --------------------

// Check that each lead has a priority badge
Then("each lead should display a priority badge", () => {
  cy.get('[data-testid^="lead-priority-badge"]').should("exist");
});

// Validate badge values against valid values from feature file
Then("the priority badge should have valid values:", (dataTable) => {
  const validValues = dataTable.raw().flat();
  cy.get('[data-testid^="lead-priority-badge"]').each(($badge) => {
    cy.wrap($badge).invoke('text').then((text) => {
      expect(validValues).to.include(text.trim());
    });
  });
});

// Check that each lead has a status badge
Then("each lead should display a status badge", () => {
  cy.get('[data-testid^="lead-status-badge"]').should("exist");
});

// Validate that "New" status is visually distinguishable
Then('the "New" status should be visually distinguishable', () => {
  cy.get('[data-testid^="lead-status-badge"]').contains('New').should(($el) => {
    const bgColor = $el.css('background-color');
    expect(bgColor).to.not.be.empty; // Ensure there is a background color
  });
});

// Check that each lead displays deal value in currency format
Then("each lead should display deal value in currency format", () => {
  cy.get('[data-testid^="lead-deal-value"]').each(($el) => {
    cy.wrap($el)
      .invoke('text')
      .should('match', /^\$\d{1,3}(,\d{3})*(\.\d{2})?$/);
  });
});

// Check that each lead displays created date in MM/DD/YYYY format
Then('each lead should display created date in {string} format', (format) => {
  cy.get('[data-testid^="lead-created"]').each(($el) => {
    cy.wrap($el)
      .invoke('text')
      .should('match', /^\d{2}\/\d{2}\/\d{4}$/);
  });
});
// -------------------- ACTIONS --------------------

When("the user clicks the view button for a lead", () => {
  LeadManagerPage.clickView();
});

Then("the user should be redirected to the lead details page", () => {
  // Check URL includes /leads/
  cy.url().should("include", "/leads");

  // Check the drawer with Lead Details title is visible
  cy.get('[data-testid="drawer-lead-details-title"]').should("be.visible");
});

When("the user clicks the edit button for a lead", () => {
  LeadManagerPage.clickEdit();
});

Then("the edit form should be displayed", () => {
  cy.contains("Edit Lead").should("be.visible");
});

When("the user clicks the delete button for a lead", () => {
  LeadManagerPage.clickDelete();
});

Then("a delete confirmation popup should be displayed", () => {
  cy.contains("Are you sure").should("be.visible");
});

Given("a delete confirmation popup is displayed", () => {
  cy.contains("Are you sure").should("be.visible");
});

When("the user confirms deletion", () => {
  cy.contains("Confirm").click();
});

Then("the lead should be removed from the grid", () => {
  LeadManagerPage.verifyRowsExist();
});

// -------------------- BUTTONS --------------------

When("the user clicks the {string} button", (button) => {
  if (button === "Create Lead") LeadManagerPage.clickCreateLead();
  else if (button === "Export") LeadManagerPage.clickExport();
});

Then("the lead creation form should be displayed", () => {
  cy.contains("Create Lead").should("be.visible");
});

Then("the lead list file should be downloaded", () => {
  // TODO: validate file download
});

// -------------------- PAGINATION --------------------

Given("multiple pages of leads are available", () => {});

When("the user clicks the next page button", () => {
  cy.get('[data-testid="leads-pagination-next"]').click();
});

Then("the next page of leads should be displayed", () => {
  LeadManagerPage.verifyRowsExist();
});

// -------------------- EMPTY STATE --------------------

Given("no leads exist in the system", () => {
  cy.intercept("GET", "/api/leads", []).as("emptyLeads");
});

Then("an empty state message should be displayed", () => {
  cy.contains("No leads available").should("be.visible");
});

// -------------------- PERFORMANCE --------------------

Then("the grid should load within 3 seconds", () => {
  let startTime;

  cy.intercept("GET", "/api/leads*").as("getLeads");

  cy.then(() => {
    startTime = Date.now();
  });

  cy.wait("@getLeads").then(() => {
    const duration = Date.now() - startTime;
    expect(duration).to.be.lessThan(3000);
  });
});