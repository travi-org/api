Feature: Thumbnails

    Scenario: User avatars in list
        Given the list of "users" is not empty
        When "/users" is requested
        Then "avatar" is populated in "users"
        And the "avatar" is sized at "32"px in "users"

    Scenario: User avatar for user
        Given user "Matt" exists
        When user "Matt" is requested by id
        Then "avatar" is populated in "Matt"
        And the "avatar" is sized at "32"px in "users"
