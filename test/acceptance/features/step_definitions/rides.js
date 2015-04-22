'use strict';

var api = require(process.cwd() + '/index.js'),
    referee = require('referee'),
    assert = referee.assert;
referee.format = require('formatio').configure({quoteStrings: false}).ascii;

module.exports = function () {
    this.World = require('../support/world.js').World;

    var resourceLists = {};

    this.Given(/^the list of "([^"]*)" is empty$/, function (resourceType, callback) {
        resourceLists[resourceType] = [];

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
};