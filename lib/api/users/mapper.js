'use strict';

var md5 = require('md5'),
    _ = require('lodash');

function mapToView(user, size, scopes) {
    user.avatar = {
        src: 'https://www.gravatar.com/avatar/' + md5(user.email) + '?size=' + size,
        size: size
    };

    if (scopes) {
        return user;
    }

    return _.omit(user, 'email');
}

function mapListToView(users, size, scopes) {
    return _.map(users, function (user) {
        return mapToView(user, size, scopes);
    });
}

module.exports = {
    mapToView: mapToView,
    mapListToView: mapListToView
};