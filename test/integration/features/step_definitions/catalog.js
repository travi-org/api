'use strict';

var api = require('../../../../index.js'),
    referee = require('referee'),
    assert = referee.assert;
referee.format = require('formatio').configure({quoteStrings: false}).ascii;

module.exports = function () {
    this.World = require('../support/world.js').World;

    var baseUrl = 'https://' + api.info.host + ':' + api.info.port;

    this.Given(/^the api contains no resources$/, function (callback) {
        callback();
    });

    this.When(/^the catalog is requested$/, function (callback) {
        var world = this;

        api.inject({
            method: 'GET',
            url: '/'
        }, function (response) {
            world.apiResponse = response;

            callback();
        });
    });

    this.Then(/^the catalog should include top level links$/, function (callback) {
        assert.equals(this.apiResponse.statusCode, 200);
        assert.equals(
            JSON.parse(this.apiResponse.payload)._links,
            {
                self: { href: baseUrl + '/' },
                rides: { href: baseUrl + '/rides' },
                users: { href: baseUrl + '/users' }
            }
        );

        callback();
    });
};
