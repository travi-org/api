Feature: Users

    Scenario: Unauthenticated request
        Given request is anonymous
        And the real list is not empty
        When "/users" is requested
        Then a list of "users" is returned
        And "email" is not included in "users"

    @wip
    Scenario: Authenticated request
        Given request is anonymous
        And the real list of "users" is not empty
        When "/users" is requested
        Then a list of "users" is returned
        And "email" is populated in "users"