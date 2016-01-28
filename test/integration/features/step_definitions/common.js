'use strict';

module.exports = function () {
    this.World = require('../support/world.js').World;

    this.After(function () {
        this.serverResponse = null;
        this.ozUserTicket = null;
    });
};
