'use strict';

var api = require(process.cwd() + '/index.js'),
    assert = require('referee').assert;

module.exports = function () {
    var apiResponse;

    this.When(/^the documentation is requested in the browser$/, function (callback) {
        api.inject({
            method: 'GET',
            url: '/documentation'
        }, function (response) {
            apiResponse = response;

            callback();
        });
    });

    this.Then(/^the documentation should be viewable in the browser$/, function (callback) {
        assert.equals(200, apiResponse.statusCode);
        assert.equals('text/html', apiResponse.headers['content-type']);

        callback();
    });
};