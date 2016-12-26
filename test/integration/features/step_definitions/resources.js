import fs from 'fs';
import hoek from 'hoek';
import _ from 'lodash';
import path from 'path';
import {OK} from 'http-status-codes';
import {defineSupportCode} from 'cucumber';
import {World} from '../support/world';
import any from '../../../helpers/any-for-api';

const resourceLists = {};
const resourceComparators = {
  rides(actualItem, expectedItem) {
    const selfLink = actualItem._links.self.href;   // eslint-disable-line no-underscore-dangle
    const ridePath = `/rides/${expectedItem.id}`;

    assert.equals(ridePath, selfLink.substring(selfLink.length - ridePath.length));
    assert.equals(actualItem.id, expectedItem.id);
    assert.equals(actualItem.nickname, expectedItem.nickname);
  },
  users(actualItem, expectedItem) {
    const selfLink = actualItem._links.self.href;   // eslint-disable-line no-underscore-dangle
    const userPath = `/users/${expectedItem.id}`;

    assert.equals(userPath, selfLink.substring(selfLink.length - userPath.length));
    assert.equals(actualItem.id, expectedItem.id);
    assert.equals(actualItem['first-name'], expectedItem['first-name']);
    assert.equals(actualItem['last-name'], expectedItem['last-name']);
  },
  persons(actualItem, expectedItem) {
    const selfLink = actualItem._links.self.href;   // eslint-disable-line no-underscore-dangle
    const personsPath = `/persons/${expectedItem.id}`;

    assert.equals(personsPath, selfLink.substring(selfLink.length - personsPath.length));
    assert.equals(actualItem.id, expectedItem.id);
    assert.equals(actualItem['first-name'], expectedItem['first-name']);
    assert.equals(actualItem['last-name'], expectedItem['last-name']);
  }
};
require('setup-referee-sinon/globals');

function makeSingular(resourceType) {
  return resourceType.substring(0, resourceType.length - 1);
}

function defineListForType(resourceType, resourceList) {
  resourceLists[resourceType] = resourceList;

  sinon.stub(fs, 'readFile')
    .withArgs(sinon.match(
      value => value.includes(`data/${resourceType}.json`),
      'utf8'
    ))
    .callsArgWithAsync(2, null, JSON.stringify(resourceList));
}

function getListForType(resourceType) {
  return resourceLists[resourceType];
}

defineSupportCode(({After, Given, When, Then, setWorldConstructor}) => {
  setWorldConstructor(World);

  After(() => {
    if (fs.readFile.restore) {
      fs.readFile.restore();
    }
  });

  Given(/^the list of "([^"]*)" is empty$/, (resourceType, callback) => {
    defineListForType(resourceType, []);

    callback();
  });

  Given(/^the list of "([^"]*)" is not empty$/, (resourceType, callback) => {
    defineListForType(resourceType, any.listOf(any.resources[makeSingular(resourceType)], {min: 1}));

    callback();
  });

  Given(/^person "([^"]*)" exists$/, (person, callback) => {
    callback();
  });

  Given(/^ride "([^"]*)" exists$/, (ride, callback) => {
    callback();
  });

  Given(/^person "([^"]*)" does not exist$/, (person, callback) => {
    callback();
  });

  Given(/^ride "([^"]*)" does not exist$/, (ride, callback) => {
    callback();
  });

  When(/^ride "([^"]*)" is requested by id$/, function (ride, callback) {
    fs.readFile(path.join(__dirname, '../../../../data/rides.json'), 'utf8', (err, content) => {
      hoek.assert(!err, err);

      const match = _.find(JSON.parse(content), _.matchesProperty('nickname', ride));
      const id = !_.isEmpty(match) ? _.result(match, 'id') : ride;

      this.getRequestTo(`/rides/${id}`, callback);
    });
  });

  When(/^person "([^"]*)" is requested by id$/, function (person, callback) {
    fs.readFile(path.join(__dirname, '../../../../data/persons.json'), 'utf8', (err, content) => {
      hoek.assert(!err, err);

      const match = _.find(JSON.parse(content), _.matchesProperty('first-name', person));
      const id = !_.isEmpty(match) ? _.result(match, 'id') : person;

      this.getRequestTo(`/persons/${id}`, callback);
    });
  });

  Then(/^a list of "([^"]*)" is returned$/, function (resourceType, callback) {
    assert.equals(this.getResponseStatus(), OK, this.getResponseBody());

    const actualList = this.getResourceListFromResponse(resourceType, JSON.parse(this.getResponseBody()));
    const expectedList = getListForType(resourceType);

    assert.equals(actualList.length, expectedList.length);
    actualList.forEach((actualItem, index) => {
      const expectedItem = expectedList[index];
      resourceComparators[resourceType](actualItem, expectedItem);
    });

    callback();
  });

  Then(/^an empty list is returned$/, function (callback) {
    assert.equals(this.getResponseStatus(), OK, this.getResponseBody());

    refute.defined(JSON.parse(this.getResponseBody())._embedded);   // eslint-disable-line no-underscore-dangle

    callback();
  });

  Then(/^person "([^"]*)" is returned$/, function (person, callback) {
    assert.equals(this.getResponseStatus(), OK, this.getResponseBody());

    assert.equals(JSON.parse(this.getResponseBody())['first-name'], person);

    callback();
  });

  Then(/^ride "([^"]*)" is returned$/, function (ride, callback) {
    assert.equals(this.getResponseStatus(), OK);
    assert.equals(JSON.parse(this.getResponseBody()).nickname, ride);

    callback();
  });

  Then(/^list of "([^"]*)" has self links populated$/, function (resourceType, callback) {
    const response = JSON.parse(this.getResponseBody());
    const items = this.getResourceListFromResponse(resourceType, response);

    assert.defined(response._links.self);   // eslint-disable-line no-underscore-dangle
    assert.greater(items.length, 0);
    items.forEach(item => {
      assert.defined(item._links.self);     // eslint-disable-line no-underscore-dangle
    });

    callback();
  });
});
