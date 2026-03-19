Feature: Lead Manager List/Grid Functionality (Automation)

  Background:
    Given the user is logged into the system
    And the user navigates to the Lead Manager page

  # -------------------- VIEW GRID --------------------

  Scenario: Display lead list with all columns
    Then the system should display a grid with columns:
      | ID | Name | Email | Company | Priority | Status | Deal Value | Source | Created | Actions |
    And each row should contain valid lead data

  Scenario: Default state of grid
    Then the "All Statuses" filter should be selected by default
    And the grid should display all leads

  # -------------------- SEARCH --------------------

  Scenario: Search leads by name
    When the user enters "Brian Young" in the search bar
    Then the grid should display only leads matching "Brian Young"

  Scenario: Search leads by email
    When the user enters "brian.young@ecommerce.co" in the search bar
    Then the grid should display only matching leads

  Scenario: No results found in search
    When the user enters "NonExistingLead" in the search bar
    Then the system should display "No leads found"
    Then the system should display "Try adjusting your search or filters to find what you're looking for."

  Scenario: Verify search placeholder text
    Then the search input should have placeholder "Search by name, email, or phone..."

  # -------------------- FILTER --------------------

  Scenario: Filter leads by New status
    When the user selects "New" from the status dropdown
    Then only leads with status "New" should be displayed

  Scenario: Reset filter to All Statuses
    When the user selects "All Statuses" from the status dropdown
    Then the grid should display all leads

  # -------------------- SORTING --------------------

  Scenario: Sort leads by Name ascending
    When the user clicks the "Name" column header
    Then the leads should be sorted in ascending order by "Name"

  Scenario: Sort leads by Name descending
    When the user clicks the "Name" column header again
    Then the leads should be sorted in descending order by "Name"

  Scenario: Sort leads by Deal Value
    When the user clicks the "Deal Value" column header
    Then the leads should be sorted numerically by "Deal Value"

  # -------------------- COLUMN VALIDATION --------------------

  Scenario: Verify priority badge display
    Then each lead should display a priority badge
    And the priority badge should have valid values:
      | Low | Medium | High | Critical |

  Scenario: Verify status badge display
    Then each lead should display a status badge
    And the "New" status should be visually distinguishable

  Scenario: Verify deal value format
    Then each lead should display deal value in currency format

# -------------------- PAGINATION --------------------

  Scenario: Navigate to next page
    Given multiple pages of leads are available
    When the user clicks the next page button
    Then the next page of leads should be displayed

  # -------------------- PERFORMANCE --------------------

  Scenario: Grid load performance
    When the user navigates to the Lead Manager page
    Then the grid should load within 3 seconds
    
  # -------------------- ACTIONS --------------------

  Scenario: View lead details
    When the user clicks the view button for a lead
    Then the user should be redirected to the lead details page

  Scenario: Edit lead
    When the user clicks the edit button for a lead
    Then the edit form should be displayed

  Scenario: Delete lead prompt
    When the user clicks the delete button for a lead
    Then a delete confirmation popup should be displayed

  Scenario: Confirm delete lead
    Given a delete confirmation popup is displayed
    When the user confirms deletion
    Then the lead should be removed from the grid

  # -------------------- CREATE LEAD --------------------

  Scenario: Create new lead
    When the user clicks the "Create Lead" button
    Then the lead creation form should be displayed

  # -------------------- EXPORT --------------------

  Scenario: Export lead list
    When the user clicks the "Export" button
    Then the lead list file should be downloaded