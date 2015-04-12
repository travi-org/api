'use strict';

var api = require(process.cwd() + '/index.js'),
    assert = require('referee').assert;

module.exports = function () {
    var apiResponse;

    this.Given(/^the api contains no resources$/, function (callback) {
        callback();
    });

    this.When(/^the catalog is requested$/, function (callback) {
        var options = {
            method: 'GET',
            url: '/api/'
        };

        api.inject(options, function (response) {
            apiResponse = response;

            callback();
        });
    });

    this.Then(/^the catalog should include top level links$/, function (callback) {
        assert.equals(200, apiResponse.statusCode);
        assert.equals(
            JSON.parse(apiResponse.payload)._links,
            {
                self: { href: '/api/' },
                hello: { href: '/hello' }
            }
        );

        callback();
    });
};
