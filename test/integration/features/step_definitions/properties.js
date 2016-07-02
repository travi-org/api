import _ from 'lodash';

function assertPropertyIsPopulatedInResource(type, property) {
    assert.defined(type[property]);
}

function assertPropertyIsNotPopulatedInResource(type, property) {
    refute.defined(type[property]);
}

function assertPropertyIn(property, resourceType, check) {
    const response = JSON.parse(this.getResponseBody());

    if (response._embedded && _.isArray(this.getResourceListFromResponse(resourceType, response))) {
        _.each(this.getResourceListFromResponse(resourceType, response), (item) => {
            check(item, property);
        });
    } else {
        check(response, property);
    }
}

module.exports = function () {
    this.World = require('../support/world.js').World;

    this.Then(/^"([^"]*)" is not included in "([^"]*)"$/, function (property, resourceType, callback) {
        assertPropertyIn.call(
            this,
            property,
            resourceType,
            assertPropertyIsNotPopulatedInResource
        );

        callback();
    });

    this.Then(/^"([^"]*)" is populated in "([^"]*)"$/, function (property, resourceType, callback) {
        assertPropertyIn.call(
            this,
            property,
            resourceType,
            assertPropertyIsPopulatedInResource
        );

        callback();
    });
};
