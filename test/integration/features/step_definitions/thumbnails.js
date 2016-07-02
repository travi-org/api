/*eslint max-params: [2, 4]*/
import _ from 'lodash';
import queryString from 'query-string';

function assertThumbnailSizedAt(property, size, response, resourceType) {
    function check(item, prop) {
        const thumbnail = item[prop];

        assert.equals(
            queryString.parse(queryString.extract(thumbnail.src)).size,
            size
        );
        assert.equals(thumbnail.size, parseInt(size, 10));
    }

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

    this.Then(/^the "([^"]*)" is sized at "([^"]*)"px in "([^"]*)"$/, function (
        property,
        size,
        resourceType,
        callback
    ) {
        assertThumbnailSizedAt.call(this, property, size, JSON.parse(this.getResponseBody()), resourceType);

        callback();
    });
};
