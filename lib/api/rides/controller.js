'use strict';

var path = require('path'),
    repo = require(path.join(__dirname, './repository'));

function getList(callback) {
    repo.getList(function (err, list) {
        callback(null, { rides: list });
    });
}

function getRide(id, callback) {
    repo.getRide(id, function (err, ride) {
        if (ride) {
            callback(null, ride);
        } else {
            callback({notFound: true});
        }
    });
}

module.exports = {
    getRide: getRide,
    getList: getList
};