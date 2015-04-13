'use strict';

var api = require(process.cwd() + '/index.js'),
    referee = require('referee'),
    assert = referee.assert;
require('referee-more-assertions')(referee);

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

    this.When(/^the docs are requested$/, function (callback) {
        api.inject({
            method: 'GET',
            url: '/docs'
        }, function (response) {
            apiResponse = response;

            callback();
        });
    });

    this.Then(/^the top\-level endpoints should be included$/, function (callback) {
        var collection = JSON.parse(apiResponse.payload).apis;
        console.log(require('formatio').ascii(collection));
        assert.containsMatch(collection, { path: 'hello' });

        callback();
    });
};