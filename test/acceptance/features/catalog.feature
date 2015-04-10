Feature: api catalog

    Scenario: the root of the api is requested
        Given the api contains no resources
        When the catalog is requested
        Then the list of links should be empty
