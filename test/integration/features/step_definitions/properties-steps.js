import {defineSupportCode} from 'cucumber';
import {assert} from 'chai';
import {World} from '../support/world';

function assertPropertyIsPopulatedInResource(type, property) {
  assert.isDefined(type[property]);
}

function assertPropertyIsNotPopulatedInResource(type, property) {
  assert.isUndefined(type[property]);
}

function assertPropertyIn(property, resourceType, check) {
  const response = JSON.parse(this.getResponseBody());

  const embedded = response._embedded;
  if (embedded && Array.isArray(this.getResourceListFromResponse(resourceType, response))) {
    this.getResourceListFromResponse(resourceType, response).forEach(item => {
      check(item, property);
    });
  } else {
    check(response, property);
  }
}

defineSupportCode(({Then, setWorldConstructor}) => {
  setWorldConstructor(World);

  Then(/^"([^"]*)" is not included in "([^"]*)"$/, function (property, resourceType, callback) {
    assertPropertyIn.call(
      this,
      property,
      resourceType,
      assertPropertyIsNotPopulatedInResource
    );

    callback();
  });

  Then(/^"([^"]*)" is populated in "([^"]*)"$/, function (property, resourceType, callback) {
    assertPropertyIn.call(
      this,
      property,
      resourceType,
      assertPropertyIsPopulatedInResource
    );

    callback();
  });
});
