'use strict';

var api = require('../../../../index.js'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash');
require('setup-referee-sinon/globals');

module.exports = function () {
    this.World = require('../support/world.js').World;

    var resourceLists = {};

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
        defineListForType(resourceType, ['foo', 'bar']);

        callback();
    });

    this.Given(/^request is anonymous$/, function (callback) {
        callback();
    });

    this.Given(/^request is authenticated$/, function (callback) {
        callback();
    });

    this.Given(/^the real list is not empty$/, function (callback) {
        callback();
    });

    this.Given(/^user "([^"]*)" exists$/, function (user, callback) {
        callback();
    });

    this.When(/^user "([^"]*)" is requested by id$/, function (user, callback) {
        var world = this;
        fs.readFile(path.join(__dirname, '../../../../data/users.json'), 'utf8', function (err, content) {
            api.inject({
                method: 'GET',
                url: '/users/' + _.result(_.find(JSON.parse(content), _.matchesProperty('first-name', user)), 'id')
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
        assert.equals(this.apiResponse.statusCode, 200);
        assert.equals(
            JSON.parse(this.apiResponse.payload).rides,
            getListForType(resourceType)
        );

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
        _.each(JSON.parse(this.apiResponse.payload)[resourceType], function (type) {
            refute.defined(type[property]);
        });

        callback();
    });

    this.Then(/^"([^"]*)" is populated in "([^"]*)"$/, function (property, resourceType, callback) {
        _.each(JSON.parse(this.apiResponse.payload)[resourceType], function (type) {
            assert.defined(type[property]);
        });

        callback();
    });

    this.Then(/^user "([^"]*)" is returned$/, function (user, callback) {
        assert.equals(JSON.parse(this.apiResponse.payload)['first-name'], user);

        callback();
    });
};