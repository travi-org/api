'use strict';

function getOzTicket(callback) {
    this.postRequestTo('http://example.com/oz/app', () => {
        assert.equals(this.getResponseStatus(), 200);

        callback();
    });
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