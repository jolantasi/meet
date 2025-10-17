Feature: Show and hide event details
  Scenario: An event element is collapsed by default
    Given the user has opened the app
    When the list of events is loaded
    Then the event element should be collapsed by default

  Scenario: User can expand an event to see its details
    Given the user sees a list of events
    When the user clicks on an event’s “Show Details” button
    Then the event element should expand to show its details

  Scenario: User can collapse an event to hide its details
    Given the event details are currently displayed
    When the user clicks on the “Hide Details” button
    Then the event element should collapse and hide the details
