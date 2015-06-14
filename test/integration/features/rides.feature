Feature: Rides

    Scenario: Empty List
        Given the list of "rides" is empty
        When "/rides" is requested
        Then an empty list is returned

    Scenario: Non-empty List
        Given the list of "rides" is not empty
        When "/rides" is requested
        Then a list of "rides" is returned