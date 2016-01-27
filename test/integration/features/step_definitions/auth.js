'use strict';

const
    oz = require('oz'),
    hoek = require('hoek'),
    apps = require('../../../../data/auth/apps'),
    grants = require('../../../../data/auth/grants');

function makeOzRequest(requestDetails, appDetails, callback) {
    const
        method = 'POST',
        url = `http://example.com${requestDetails.endpoint}`;

    this.requestTo(
        {
            url,
            method,
            headers: {
                authorization: oz.client.header(url, method, appDetails).field
            },
            payload: requestDetails.payload
        },
        () => {
            //console.log(this.getResponseBody());
            assert.equals(this.getResponseStatus(), 200);

            callback(null, this.serverResponse.result.entity);
        }
    );
}

function requestAppTicket(appDetails, callback) {
    makeOzRequest.call(this, {endpoint: '/oz/app'}, appDetails, callback);
}

function simulateUserGettingRsvpByGrantingScopes(callback) {
    oz.ticket.rsvp(apps.foo, grants[0], 'password', {}, callback);
}

function exchangeRsvpForUserTicket(appTicket, rsvp, callback) {
    makeOzRequest.call(this, {
        endpoint: '/oz/rsvp',
        payload: JSON.stringify({rsvp})
    }, appTicket, callback);
}

function getUserTicket(callback) {
    requestAppTicket.call(this, apps.foo, (err, appTicket) => {
        hoek.assert(!err, err);

        simulateUserGettingRsvpByGrantingScopes.call(this, (err, rsvp) => {
            hoek.assert(!err, err);

            exchangeRsvpForUserTicket.call(this, appTicket, rsvp, callback);
        });
    });
}

module.exports = function () {
    this.World = require('../support/world.js').World;

    this.Given(/^request is anonymous$/, function (callback) {
        callback();
    });

    this.Given(/^request includes oz ticket$/, function (callback) {
        getUserTicket.call(this, callback);
    });
};