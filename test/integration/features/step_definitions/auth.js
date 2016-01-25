'use strict';

module.exports = function () {
    this.World = require('../support/world.js').World;

    this.Given(/^request is anonymous$/, function (callback) {
        callback();
    });

    this.Given(/^request includes oz ticket$/, function (callback) {
        callback();
    });
};