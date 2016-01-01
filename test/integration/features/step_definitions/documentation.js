'use strict';

const
    referee = require('referee'),
    assert = referee.assert;
require('referee-more-assertions')(referee);

module.exports = function () {
    this.When(/^the documentation is requested in the browser$/, function (callback) {
        this.makeRequestTo('/documentation', callback);
    });

    this.Then(/^the documentation should be viewable in the browser$/, function (callback) {
        assert.equals(this.getResponseStatus(), 200);
        assert.equals('text/html', this.getResponseHeaders()['content-type']);

        callback();
    });

    this.When(/^the docs are requested$/, function (callback) {
        this.makeRequestTo('/swagger', callback);
    });

    this.Then(/^the top\-level endpoints should be included$/, function (callback) {
        var paths = JSON.parse(this.getResponseBody()).paths;
        assert.defined(paths['/rides']);
        assert.defined(paths['/users']);

        callback();
    });

    this.Then(/^the GET by id endpoints should be included$/, function (callback) {
        var paths = JSON.parse(this.getResponseBody()).paths;

        assert.defined(paths['/rides/{id}']);
        assert.defined(paths['/users/{id}']);

        callback();
    });
};