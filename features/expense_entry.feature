Feature: Expense Entry
  Record a basic expense with summary, amount, and category so I can track spending.

  Background:
    Given the expense list is empty

  Scenario: Record a valid expense with a new category
    When I enter an expense with summary "Coffee" amount 3.50 category "Food"
    Then the expense is stored
    And the category "Food" is available for future selection

  Scenario: Reject negative amount
    When I enter an expense with summary "Refund" amount -2.00 category "Misc"
    Then I see a validation error "Amount must be positive"

  Scenario: Reject missing summary
    When I enter an expense with summary "" amount 5.00 category "Snacks"
    Then I see a validation error "Summary is required"
