Feature: Persons

    Scenario: Unauthenticated request for list
        Given request is anonymous
        And the list of "persons" is not empty
        When "/persons" is requested
        Then a list of "persons" is returned
        And list of "persons" has self links populated
        And "email" is not included in "persons"

    Scenario: Request for list with elevated privileges
        Given request includes oz ticket
        And the list of "persons" is not empty
        When "/persons" is requested
        Then a list of "persons" is returned
        And "email" is populated in "persons"

    Scenario: Unauthenticated request for person by id
        Given request is anonymous
        And person "Matt" exists
        When person "Matt" is requested by id
        Then person "Matt" is returned
        And "email" is not included in "Matt"

    Scenario: Request for non-existent person
        Given person "Bob" does not exist
        When person "Bob" is requested by id
        Then the response will be "Not Found"

    Scenario: Request for person by id with elevated privileges
        Given request includes oz ticket
        And person "Matt" exists
        When person "Matt" is requested by id
        Then person "Matt" is returned
        But "email" is populated in "Matt"
