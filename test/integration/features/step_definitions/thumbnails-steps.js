import queryString from 'query-string';
import {defineSupportCode} from '@cucumber/cucumber';
import {assert} from 'chai';
import {World} from '../support/world';

function assertThumbnailSizedAt(property, size, response, resourceType) {
  function check(item, prop) {
    const thumbnail = item[prop];

    assert.equal(
      queryString.parse(queryString.extract(thumbnail.src)).size,
      size
    );
    assert.equal(thumbnail.size, parseInt(size, 10));
  }

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

  Then(/^the "([^"]*)" is sized at "([^"]*)"px in "([^"]*)"$/, function (
    property,
    size,
    resourceType,
    callback
  ) {
    assertThumbnailSizedAt.call(this, property, size, JSON.parse(this.getResponseBody()), resourceType);

    callback();
  });
});
