'use strict';

const
    path = require('path'),
    repo = require(path.join(__dirname, './repository')),
    mapper = require(path.join(__dirname, './mapper')),

    THUMBNAIL_SIZE = 32,
    AVATAR_SIZE = 320;

function getList(scopes, callback) {
    repo.getList((err, list) => {
        if (err) {
            callback(err);
        } else {
            callback(null, { users: mapper.mapListToView(list, THUMBNAIL_SIZE, scopes) });
        }
    });
}

function getUser(id, scopes, callback) {
    repo.getUser(id, (err, user) => {
        if (err) {
            callback(err);
        } else if (user) {
            callback(null, mapper.mapToView(user, AVATAR_SIZE, scopes));
        } else {
            callback({notFound: true});
        }
    });
}

module.exports = {
    getList,
    getUser
};
