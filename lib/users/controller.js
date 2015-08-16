'use strict';

var path = require('path'),
    repo = require(path.join(__dirname, '../../lib/users/repository')),
    mapper = require(path.join(__dirname, '../../lib/users/mapper'));

function getList(callback) {
    repo.getList(function (err, list) {
        callback(null, { users: mapper.mapListToView(list, 32) });
    });
}

function getUser(id, callback) {
    repo.getUser(id, function (err, user) {
        if (user) {
            callback(null, mapper.mapToView(user, 320));
        } else {
            callback({notFound: true});
        }
    });
}

module.exports = {
    getList: getList,
    getUser: getUser
};