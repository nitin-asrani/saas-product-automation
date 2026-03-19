class LeadManagerPage {
  // ---------- NAVIGATION ----------
  visit() {
    cy.visit("/leads");
  }

  // ---------- SEARCH ----------
  search(text) {
    cy.get('[data-testid="leads-search-input"]').clear().type(text);
    cy.wait(5000);
  }

  getSearchInput() {
    return cy.get('[data-testid="leads-search-input"]');
  }

  // ---------- GRID ----------
  getGridRows() {
    return cy.get('[data-testid^="lead-row-"]');
  }

  getColumnHeader(column) {
    return cy.contains("th", column).scrollIntoView();
  }

  getColumnCells(column) {
    return cy.get('[data-testid^="lead-row-"]').then(($rows) => {
      const cells = [];
      $rows.each((_, row) => {
        const cell = Cypress.$(row).find(`td:contains("${column}")`);
        if (cell.length) cells.push(cell[0]);
      });
      return cy.wrap(cells);
    });
  }

  // ---------- FILTER ----------
  selectStatus(status) {
  // Click the dropdown to open
  this.getStatusDropdown().click();
  
  // Click the option inside the dropdown
  cy.contains('div[role="option"]', status).click();
  
  // Verify the dropdown now shows the selected status
  this.getStatusDropdownValue().then((value) => {
  expect(value.trim()).to.eq(status);
  });
  
  cy.wait(5000);
  }

  getStatusDropdown() {
  return cy.get('[data-testid="leads-status-filter"]');
  }

  getStatusDropdownValue() {
  // Returns the text of the currently selected status
  return cy
    .get('[data-testid="leads-status-filter"]')
    .find('span[data-slot="select-value"]')
    .invoke('text');
  }

  // ---------- ACTIONS ----------
  clickCreateLead() {
    cy.get('[data-testid="leads-create-new-btn"]').click();
  }

  clickExport() {
    cy.get('[data-testid="leads-export-btn"]').click();
  }

  clickView() {
    cy.get('[data-testid^="lead-view-btn-"]').first().click();
  }

  clickEdit() {
    cy.get('[data-testid^="lead-edit-btn-"]').first().click();
  }

  clickDelete() {
    cy.get('[data-testid^="lead-delete-btn-"]').first().click();
  }

  // ---------- VALIDATIONS ----------
  verifyNoResults(message) {
    cy.contains(message).should("be.visible");
  }

  verifyColumnExists(column) {
    cy.contains("th", column).scrollIntoView().should("exist").should("be.visible");
  }

  verifyRowsExist() {
    this.getGridRows().should("have.length.greaterThan", 0);
  }

  getPriorityBadges() {
    return cy.get('[data-testid^="lead-row-"] [data-testid="lead-priority-badge"]');
  }

  getStatusBadges() {
    return cy.get('[data-testid^="lead-row-"] [data-testid="lead-status-badge"]');
  }

  getDealValueCells() {
    return cy.get('[data-testid^="lead-row-"] [data-testid="lead-deal-value"]');
  }

  getCreatedDateCells() {
    return cy.get('[data-testid^="lead-row-"] [data-testid="lead-created"]');
  }
}

export default new LeadManagerPage();