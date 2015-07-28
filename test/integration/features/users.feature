Feature: Users

    Scenario: Unauthenticated request for list
        Given request is anonymous
        And the list of "users" is not empty
        When "/users" is requested
        Then a list of "users" is returned
        And list of "users" has self links populated
        And "email" is not included in "users"

    @wip
    Scenario: Authenticated request for list
        Given request is authenticated
        And the list of "users" is not empty
        When "/users" is requested
        Then a list of "users" is returned
        And "email" is populated in "users"

    Scenario: Unauthenticated request for user by id
        Given request is anonymous
        And user "Matt" exists
        When user "Matt" is requested by id
        Then user "Matt" is returned
        And "email" is not included in "Matt"

    Scenario: Request for non-existent user
        Given user "Bob" does not exist
        When user "Bob" is requested by id
        Then the response will be "Not Found"

    @wip
    Scenario: Authenticated request for user by id
        Given request is anonymous
        And user "Matt" exists
        When user "Matt" is requested by id
        Then user "Matt" is returned
        But "email" is populated in "Matt"
