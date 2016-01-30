'use strict';

const
    fs = require('fs'),
    path = require('path'),
    hoek = require('hoek'),
    _ = require('lodash'),
    any = require(path.join(__dirname, '../../../helpers/any-for-api')),

    resourceLists = {},
    SUCCESS = 200,
    resourceComparators = {
        rides(actualItem, expectedItem) {
            const
                selfLink = actualItem._links.self.href,
                ridePath = `/rides/${expectedItem.id}`;

            assert.equals(ridePath, selfLink.substring(selfLink.length - ridePath.length));
            assert.equals(actualItem.id, expectedItem.id);
            assert.equals(actualItem.nickname, expectedItem.nickname);
        },
        users(actualItem, expectedItem) {
            const
                selfLink = actualItem._links.self.href,
                userPath = `/users/${expectedItem.id}`;

            assert.equals(userPath, selfLink.substring(selfLink.length - userPath.length));
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
            (value) => {
                return _.includes(value, `data/${resourceType}.json`);
            },
            'utf8'
        ))
        .callsArgWithAsync(2, null, JSON.stringify(resourceList));
}

function getListForType(resourceType) {
    return resourceLists[resourceType];
}

module.exports = function () {
    this.World = require('../support/world.js').World;

    this.After(() => {
        if (fs.readFile.restore) {
            fs.readFile.restore();
        }
    });

    this.Given(/^the list of "([^"]*)" is empty$/, (resourceType, callback) => {
        defineListForType(resourceType, []);

        callback();
    });

    this.Given(/^the list of "([^"]*)" is not empty$/, (resourceType, callback) => {
        defineListForType(resourceType, any.listOf(any.resources[makeSingular(resourceType)], {min: 1}));

        callback();
    });

    this.Given(/^user "([^"]*)" exists$/, (user, callback) => {
        callback();
    });

    this.Given(/^ride "([^"]*)" exists$/, (ride, callback) => {
        callback();
    });

    this.Given(/^user "([^"]*)" does not exist$/, (user, callback) => {
        callback();
    });

    this.Given(/^ride "([^"]*)" does not exist$/, (ride, callback) => {
        callback();
    });

    this.When(/^ride "([^"]*)" is requested by id$/, function (ride, callback) {
        fs.readFile(path.join(__dirname, '../../../../data/rides.json'), 'utf8', (err, content) => {
            hoek.assert(!err, err);

            const
                match = _.find(JSON.parse(content), _.matchesProperty('nickname', ride)),
                id = !_.isEmpty(match) ? _.result(match, 'id') : ride;

            this.getRequestTo(`/rides/${id}`, callback);
        });
    });

    this.When(/^user "([^"]*)" is requested by id$/, function (user, callback) {
        fs.readFile(path.join(__dirname, '../../../../data/users.json'), 'utf8', (err, content) => {
            hoek.assert(!err, err);

            const
                match = _.find(JSON.parse(content), _.matchesProperty('first-name', user)),
                id = !_.isEmpty(match) ? _.result(match, 'id') : user;

            this.getRequestTo(`/users/${id}`, callback);
        });
    });

    this.Then(/^a list of "([^"]*)" is returned$/, function (resourceType, callback) {
        assert.equals(this.getResponseStatus(), SUCCESS, this.getResponseBody());

        const
            actualList = JSON.parse(this.getResponseBody())._embedded[resourceType],
            expectedList = getListForType(resourceType);

        assert.equals(actualList.length, expectedList.length);
        _.forEach(actualList, (actualItem, index) => {
            const expectedItem = expectedList[index];
            resourceComparators[resourceType](actualItem, expectedItem);
        });

        callback();
    });

    this.Then(/^an empty list is returned$/, function (callback) {
        assert.equals(this.getResponseStatus(), SUCCESS, this.getResponseBody());

        refute.defined(JSON.parse(this.getResponseBody())._embedded);

        callback();
    });

    this.Then(/^user "([^"]*)" is returned$/, function (user, callback) {
        assert.equals(this.getResponseStatus(), SUCCESS, this.getResponseBody());

        assert.equals(JSON.parse(this.getResponseBody())['first-name'], user);

        callback();
    });

    this.Then(/^ride "([^"]*)" is returned$/, function (ride, callback) {
        assert.equals(this.getResponseStatus(), SUCCESS);
        assert.equals(JSON.parse(this.getResponseBody()).nickname, ride);

        callback();
    });

    this.Then(/^list of "([^"]*)" has self links populated$/, function (resourceType, callback) {
        const
            response = JSON.parse(this.getResponseBody()),
            items = response._embedded[resourceType];

        assert.defined(response._links.self);
        assert.greater(items.length, 0);
        _.forEach(items, (item) => {
            assert.defined(item._links.self);
        });

        callback();
    });
};
