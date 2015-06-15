Feature: Users

    Scenario: Unauthenticated request
        Given request is anonymous
        And the real list is not empty
        When "/users" is requested
        Then a list of "users" is returned
        And "email" is not included in "users"
        But "avatar" is populated in "users"

    @wip
    Scenario: Authenticated request
        Given request is anonymous
        And the real list is not empty
        When "/users" is requested
        Then a list of "users" is returned
        And "email" is populated in "users"