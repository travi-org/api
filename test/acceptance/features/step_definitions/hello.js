'use strict';

var api = require(process.cwd() + '/index.js'),
    assert = require('referee').assert;

module.exports = function () {
    this.World = require('../support/world.js').World;

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

    this.Then(/^"([^"]*)" is returned as the response$/, function (message, callback) {
        assert.equals(JSON.parse(this.apiResponse.payload).message, message);

        callback();
    });
};
