import fs from 'fs';
import hoek from 'hoek';
import _ from 'lodash';
import path from 'path';
import {OK} from 'http-status-codes';
import {defineSupportCode} from 'cucumber';
import sinon from 'sinon';
import {assert} from 'chai';
import {World} from '../support/world';
import any from '../../../helpers/any-for-api';

sinon.behavior = require('sinon/lib/sinon/behavior');

sinon.defaultConfig = {
  injectInto: null,
  properties: ['spy', 'stub', 'mock', 'clock', 'server', 'requests'],
  useFakeTimers: true,
  useFakeServer: true
};

const resourceLists = {};
const resourceComparators = {
  rides(actualItem, expectedItem) {
    const selfLink = actualItem._links.self.href;
    const ridePath = `/rides/${expectedItem.id}`;

    assert.equal(ridePath, selfLink.substring(selfLink.length - ridePath.length));
    assert.equal(actualItem.id, expectedItem.id);
    assert.equal(actualItem.nickname, expectedItem.nickname);
  },
  users(actualItem, expectedItem) {
    const selfLink = actualItem._links.self.href;
    const userPath = `/users/${expectedItem.id}`;

    assert.equal(userPath, selfLink.substring(selfLink.length - userPath.length));
    assert.equal(actualItem.id, expectedItem.id);
    assert.equal(actualItem['first-name'], expectedItem['first-name']);
    assert.equal(actualItem['last-name'], expectedItem['last-name']);
  },
  persons(actualItem, expectedItem) {
    const selfLink = actualItem._links.self.href;
    const personsPath = `/persons/${expectedItem.id}`;

    assert.equal(personsPath, selfLink.substring(selfLink.length - personsPath.length));
    assert.equal(actualItem.id, expectedItem.id);
    assert.equal(actualItem['first-name'], expectedItem['first-name']);
    assert.equal(actualItem['last-name'], expectedItem['last-name']);
  }
};

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
    assert.equal(this.getResponseStatus(), OK, this.getResponseBody());

    const actualList = this.getResourceListFromResponse(resourceType, JSON.parse(this.getResponseBody()));
    const expectedList = getListForType(resourceType);

    assert.equal(actualList.length, expectedList.length);
    actualList.forEach((actualItem, index) => {
      const expectedItem = expectedList[index];
      resourceComparators[resourceType](actualItem, expectedItem);
    });

    callback();
  });

  Then(/^an empty list is returned$/, function (callback) {
    assert.equal(this.getResponseStatus(), OK, this.getResponseBody());

    assert.isUndefined(JSON.parse(this.getResponseBody())._embedded);

    callback();
  });

  Then(/^person "([^"]*)" is returned$/, function (person, callback) {
    assert.deepEqual(this.getResponseStatus(), OK, this.getResponseBody());

    assert.deepEqual(JSON.parse(this.getResponseBody())['first-name'], person);

    callback();
  });

  Then(/^ride "([^"]*)" is returned$/, function (ride, callback) {
    assert.equal(this.getResponseStatus(), OK);
    assert.deepEqual(JSON.parse(this.getResponseBody()).nickname, ride);

    callback();
  });

  Then(/^list of "([^"]*)" has self links populated$/, function (resourceType, callback) {
    const response = JSON.parse(this.getResponseBody());
    const items = this.getResourceListFromResponse(resourceType, response);

    assert.isDefined(response._links.self);
    assert.isAbove(items.length, 0);
    items.forEach(item => {
      assert.isDefined(item._links.self);
    });

    callback();
  });
});
