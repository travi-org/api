'use strict';

var path = require('path'),
    repo = require(path.join(__dirname, '../../lib/users/repository')),
    mapper = require(path.join(__dirname, '../../lib/users/mapper'));

function getList(callback) {
    repo.getList(function (err, list) {
        callback(null, { users: mapper.mapListToView(list, 32) });
    });
}

module.exports = {
    getList: getList
};