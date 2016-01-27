'use strict';

const
    oz = require('oz'),
    apps = require('../../../../data/auth/apps');

function getOzTicket(callback) {
    const
        url = `http://example.com/oz/app`,
        method = 'POST',
        appTicket = apps.foo;

    this.requestTo(
        {
            url,
            method,
            headers: {
                authorization: oz.client.header(url, method, appTicket).field
            }
        },
        () => {
            assert.equals(this.getResponseStatus(), 200);

            callback();
        }
    );
}

module.exports = function () {
    this.World = require('../support/world.js').World;

    this.Given(/^request is anonymous$/, function (callback) {
        callback();
    });

    this.Given(/^request includes oz ticket$/, function (callback) {
        getOzTicket.call(this, callback);
    });
};