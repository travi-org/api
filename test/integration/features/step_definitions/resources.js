'use strict';

var api = require('../../../../index.js'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    any = require(path.join(__dirname, '../../../helpers/any-for-api'));
require('setup-referee-sinon/globals');

module.exports = function () {
    this.World = require('../support/world.js').World;

    var resourceLists = {},
        resourceComparators = {
            rides: function (actualItem, expectItem) {
                assert.equals(actualItem, expectItem);
            },
            users: function (actualItem, expectedItem) {
                assert.equals(actualItem.id, expectedItem.id);
                assert.equals(actualItem['first-name'], expectedItem['first-name']);
                assert.equals(actualItem['last-name'], expectedItem['last-name']);
            }
        };

    function makeSingular(resourceType) {
        return resourceType.substring(0, resourceType.length - 1);
    }

    function defineListForType(resourceType, resourceList) {
        resourceLists[resourceType] = resourceList;

        sinon.stub(fs, 'readFile')
            .withArgs(sinon.match(
                function (value) {
                    return value.indexOf('data/' + resourceType + '.json') > -1;
                },
                'utf8'
            ))
            .callsArgWithAsync(2, null, JSON.stringify(resourceList));
    }

    function getListForType(resourceType) {
        return resourceLists[resourceType];
    }

    function assertPropertyIsPopulatedInResource(type, property) {
        assert.defined(type[property]);
    }

    function assertPropertyIsNotPopulatedInResource(type, property) {
        refute.defined(type[property]);
    }

    function assertPropertyIn(property, response, resourceType, check) {
        if (_.isArray(response[resourceType])) {
            _.each(response[resourceType], function (item) {
                check(item, property);
            });
        } else {
            check(response, property);
        }
    }

    this.After(function (callback) {
        if (fs.readFile.restore) {
            fs.readFile.restore();
        }

        callback();
    });

    this.Given(/^the list of "([^"]*)" is empty$/, function (resourceType, callback) {
        defineListForType(resourceType, []);

        callback();
    });

    this.Given(/^the list of "([^"]*)" is not empty$/, function (resourceType, callback) {
        defineListForType(resourceType, any.listOf(any.resources[makeSingular(resourceType)]));

        callback();
    });

    this.Given(/^request is anonymous$/, function (callback) {
        callback();
    });

    this.Given(/^request is authenticated$/, function (callback) {
        callback();
    });

    this.Given(/^user "([^"]*)" exists$/, function (user, callback) {
        callback();
    });

    this.Given(/^ride "([^"]*)" exists$/, function (ride, callback) {
        callback();
    });

    this.Given(/^user "([^"]*)" does not exist$/, function (user, callback) {
        callback();
    });

    this.When(/^ride "([^"]*)" is requested by id$/, function (ride, callback) {
        var world = this;

        api.inject({
            method: 'GET',
            url: '/rides/' + ride
        }, function (response) {
            world.apiResponse = response;
            callback();
        });
    });

    this.When(/^user "([^"]*)" is requested by id$/, function (user, callback) {
        var world = this;

        fs.readFile(path.join(__dirname, '../../../../data/users.json'), 'utf8', function (err, content) {
            var match = _.find(JSON.parse(content), _.matchesProperty('first-name', user)),
                id = !_.isEmpty(match) ? _.result(match, 'id') : user;

            api.inject({
                method: 'GET',
                url: '/users/' + id
            }, function (response) {
                world.apiResponse = response;
                callback();
            });
        });
    });

    this.When(/^"([^"]*)" is requested$/, function (path, callback) {
        var world = this;

        api.inject({
            method: 'GET',
            url: path
        }, function (response) {
            world.apiResponse = response;
            callback();
        });
    });

    this.Then(/^a list of "([^"]*)" is returned$/, function (resourceType, callback) {
        var actualList = JSON.parse(this.apiResponse.payload)[resourceType],
            expectedList = getListForType(resourceType);

        assert.equals(this.apiResponse.statusCode, 200);
        assert.equals(actualList.length, expectedList.length);
        _.forEach(actualList, function (actualItem, index) {
            var expectedItem = expectedList[index];
            resourceComparators[resourceType](actualItem, expectedItem);
        });

        callback();
    });

    this.Then(/^an empty list is returned$/, function (callback) {
        assert.equals(this.apiResponse.statusCode, 200);
        assert.equals(
            JSON.parse(this.apiResponse.payload).rides,
            []
        );

        callback();
    });

    this.Then(/^"([^"]*)" is not included in "([^"]*)"$/, function (property, resourceType, callback) {
        assertPropertyIn(
            property,
            JSON.parse(this.apiResponse.payload),
            resourceType,
            assertPropertyIsNotPopulatedInResource
        );

        callback();
    });

    this.Then(/^"([^"]*)" is populated in "([^"]*)"$/, function (property, resourceType, callback) {
        assertPropertyIn(
            property,
            JSON.parse(this.apiResponse.payload),
            resourceType,
            assertPropertyIsPopulatedInResource
        );

        callback();
    });

    this.Then(/^user "([^"]*)" is returned$/, function (user, callback) {
        assert.equals(JSON.parse(this.apiResponse.payload)['first-name'], user);

        callback();
    });

    this.Then(/^ride "([^"]*)" is returned$/, function (ride, callback) {
        assert.equals(JSON.parse(this.apiResponse.payload).ride, ride);

        callback();
    });

    this.Then(/^the response will be "([^"]*)"$/, function (status, callback) {
        var statuses = {
            'Not Found': 404
        };

        assert.equals(this.apiResponse.statusCode, statuses[status]);

        callback();
    });
};