function assertPropertyIsPopulatedInResource(type, property) {
  assert.defined(type[property]);
}

function assertPropertyIsNotPopulatedInResource(type, property) {
  refute.defined(type[property]);
}

function assertPropertyIn(property, resourceType, check) {
  const response = JSON.parse(this.getResponseBody());

  const embedded = response._embedded;    // eslint-disable-line no-underscore-dangle
  if (embedded && Array.isArray(this.getResourceListFromResponse(resourceType, response))) {
    this.getResourceListFromResponse(resourceType, response).forEach(item => {
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
