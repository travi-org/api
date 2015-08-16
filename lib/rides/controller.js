'use strict';

var path = require('path'),
    repo = require(path.join(__dirname, '../../lib/rides/repository'));

function getList(callback) {
    repo.getList(function (err, list) {
        callback(null, { rides: list });
    });
}

module.exports = {
    getList: getList
};