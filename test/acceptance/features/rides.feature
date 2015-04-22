Feature: Rides

    Scenario: List
        Given the list of "rides" is empty
        When "/rides" is requested
        Then an empty list is returned