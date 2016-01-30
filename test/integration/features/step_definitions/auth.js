'use strict';

const
    oz = require('oz'),
    hoek = require('hoek'),
    apps = require('../../../../data/auth/apps'),
    grants = require('../../../../data/auth/grants');

function requestAppTicket(appDetails, callback) {
    this.makeOzRequest({endpoint: '/oz/app'}, appDetails, callback);
}

function simulateUserGettingRsvpByGrantingScopes(callback) {
    oz.ticket.rsvp(apps.foo, grants[0], 'password', {}, callback);
}

function exchangeRsvpForUserTicket(appTicket, rsvp, callback) {
    this.makeOzRequest({
        endpoint: '/oz/rsvp',
        payload: JSON.stringify({rsvp})
    }, appTicket, callback);
}

function getUserTicket(callback) {
    requestAppTicket.call(this, apps.foo, (err, appTicket) => {
        hoek.assert(!err, err);

        simulateUserGettingRsvpByGrantingScopes.call(this, (err, rsvp) => {
            hoek.assert(!err, err);

            exchangeRsvpForUserTicket.call(this, appTicket, rsvp, (err, userTicket) => {
                hoek.assert(!err, err);

                this.ozUserTicket = userTicket;

                callback();
            });
        });
    });
}

module.exports = function () {
    this.World = require('../support/world.js').World;

    this.Given(/^request is anonymous$/, (callback) => {
        callback();
    });

    this.Given(/^request includes oz ticket$/, function (callback) {
        getUserTicket.call(this, callback);
    });
};
