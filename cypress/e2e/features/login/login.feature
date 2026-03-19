Feature: Login Functionality - Lead Manager (Automation)

  Background:
    Given the user is on the login page

  # =========================
  # Positive Test Scenarios
  # =========================

  Scenario: Successful login as Admin user
    When the user enters email "admin@company.com"
    And the user enters password "Admin@123"
    And the user clicks the "Sign in" button
    Then the user should be logged in successfully
    And the user should see the "Administrator"
    And the user should have "full access" permissions

  Scenario: Successful login as Manager user
    When the user enters email "qa@company.com"
    And the user enters password "password123"
    And the user clicks the "Sign in" button
    Then the user should be logged in successfully
    And the user should see the "Manager"
    And the user should have "limited access" permissions

  Scenario: Successful login as Viewer user
    When the user enters email "tester@company.com"
    And the user enters password "Test@456"
    And the user clicks the "Sign in" button
    Then the user should be logged in successfully
    And the user should see the "Viewer"
    And the user should have "read-only" permissions

  # =========================
  # Negative Test Scenarios
  # =========================

  Scenario: Login fails with incorrect password
    When the user enters email "admin@company.com"
    And the user enters password "wrongpass"
    And the user clicks the "Sign in" button
    Then the login should fail
    And the user should see the error message "Invalid credentials"

  Scenario: Login fails with unregistered email
    When the user enters email "unknown@test.com"
    And the user enters password "password123"
    And the user clicks the "Sign in" button
    Then the login should fail
    And the user should see the error message "Invalid credentials"

  Scenario: Login fails with invalid email format
    When the user enters email "notanemail@g"
    And the user enters password "password123"
    And the user clicks the "Sign in" button
    Then the login should fail
    And the user should see the error message "Invalid email format"

  Scenario: Login fails with empty fields
    When the user leaves the email field empty
    And the user leaves the password field empty
    And the user clicks the "Sign in" button
    Then the login should fail
    And the user should see the error message "Email is required"
    And the user should see the error message "Password is required"

  # =========================
  # Data-Driven Scenario
  # =========================

  Scenario Outline: Login attempts with various invalid inputs
    When the user enters email "<email>"
    And the user enters password "<password>"
    And the user clicks the "Sign in" button
    Then the login should fail
    And the user should see the error message "<error_message>"

    Examples:
      | email               | password     | error_message         |
      | admin@company.com   | wrongpass    | Invalid credentials   |
      | unknown@test.com    | password123  | Invalid credentials   |
      | notanemail@g        | password123  | Invalid email format  |
      |                     | password123  | Email is required     |
      | unknown@test.com    |              | Password is required  |