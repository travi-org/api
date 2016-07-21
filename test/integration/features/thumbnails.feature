Feature: Thumbnails

    Scenario: User avatars in list
        Given the list of "persons" is not empty
        When "/persons" is requested
        Then "avatar" is populated in "persons"
        And the "avatar" is sized at "32"px in "persons"

    Scenario: User avatar for user
        Given person "Matt" exists
        When person "Matt" is requested by id
        Then "avatar" is populated in "Matt"
        And the "avatar" is sized at "320"px in "persons"
