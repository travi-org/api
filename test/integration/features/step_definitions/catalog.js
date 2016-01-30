'use strict';

const
    referee = require('referee'),
    assert = referee.assert;
referee.format = require('formatio').configure({quoteStrings: false}).ascii;

module.exports = function () {
    const SUCCESS = 200;

    this.World = require('../support/world.js').World;

    this.Given(/^the api contains no resources$/, (callback) => {
        callback();
    });

    this.When(/^the catalog is requested$/, function (callback) {
        this.getRequestTo('/', callback);
    });

    this.Then(/^the catalog should include top level links$/, function (callback) {
        const baseUrl = this.getBaseUrl();

        assert.equals(this.getResponseStatus(), SUCCESS);
        assert.equals(
            JSON.parse(this.getResponseBody())._links,
            {
                self: { href: `${baseUrl}/` },
                rides: { href: `${baseUrl}/rides` },
                users: { href: `${baseUrl}/users` }
            }
        );

        callback();
    });
};
