Feature: Specify number of events
  Scenario: When user hasn’t specified a number, 32 events are shown by default
    Given the user hasn’t specified the number of events
    When the user opens the app
    Then 32 events should be displayed by default

  Scenario: User can change the number of events displayed
    Given the user has opened the app
    When the user sets the number of events to 10
    Then only 10 events should be displayed
