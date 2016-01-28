'use strict';

var path = require('path'),
    repo = require(path.join(__dirname, './repository')),
    mapper = require(path.join(__dirname, './mapper'));

function getList(scopes, callback) {
    repo.getList(function (err, list) {
        if (err) {
            callback(err);
        } else {
            callback(null, { users: mapper.mapListToView(list, 32) });
        }
    });
}

function getUser(id, callback) {
    repo.getUser(id, function (err, user) {
        if (err) {
            callback(err);
        } else if (user) {
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