@ui
Feature: Expense Entry UI
  Visualize and interact with expense entry form in the browser.

  Background:
    Given I open the expense entry page

  Scenario: Submit valid expense
    When I fill the summary field with "Coffee"
    And I fill the amount field with "3.50"
    And I fill the category field with "Food"
    And I submit the expense form
    Then I should see an expense row with summary "Coffee" amount "$3.50" category "food"

  Scenario: Reject negative amount
    When I fill the summary field with "Refund"
    And I fill the amount field with "-2"
    And I fill the category field with "Misc"
    And I submit the expense form
    Then I should see an inline error "Amount must be positive"

  Scenario: Reject missing summary
    When I fill the summary field with ""
    And I fill the amount field with "5"
    And I fill the category field with "Snacks"
    And I submit the expense form
    Then I should see an inline error "Summary is required"
