Feature: Expense Entry
  Record a basic expense with summary, amount, and category so I can track spending.

  Background:
    Given the expense list is empty

  @logic
  Scenario: Record a valid expense with a new category
    When I enter an expense with summary "Coffee" amount 3.50 category "Food"
    Then the expense is stored
    And the category "Food" is available for future selection

  @logic
  Scenario: Reject negative amount
    When I enter an expense with summary "Refund" amount -2.00 category "Misc"
    Then I see a validation error "Amount must be positive"

  @logic
  Scenario: Reject missing summary
    When I enter an expense with summary "" amount 5.00 category "Snacks"
    Then I see a validation error "Summary is required"

  @logic
  Scenario: Duplicate category (case + whitespace) is silently reused
    When I enter an expense with summary "Lunch" amount 12.00 category "Food"
    And I enter an expense with summary "Dinner" amount 20.00 category "  food  "
    Then the category set size is 1

  @logic
  Scenario: Amount with more than 2 decimals is rejected
    When I enter an expense with summary "Rounded" amount 3.567 category "Misc"
    Then I see a validation error "Amount must have at most 2 decimals"

  @logic
  Scenario: Blank category defaults to uncategorized
    When I enter an expense with summary "Water" amount 1.00 category ""
    Then the last expense category is "uncategorized"
