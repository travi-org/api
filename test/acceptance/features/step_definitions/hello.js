'use strict';

var api = require(process.cwd() + '/index.js'),
    assert = require('referee').assert;

module.exports = function () {
    var apiResponse;

    this.When(/^"([^"]*)" is requested$/, function (path, callback) {
        api.inject({
            method: 'GET',
            url: path
        }, function (response) {
            apiResponse = response;
            callback();
        });
    });

    this.Then(/^"([^"]*)" is returned as the response$/, function (message, callback) {
        assert.equals(JSON.parse(apiResponse.payload).message, message);

        callback();
    });
};
