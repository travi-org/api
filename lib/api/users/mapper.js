'use strict';

var md5 = require('md5'),
    _ = require('lodash');

function mapToView(user, size) {
    user.avatar = {
        src: 'https://www.gravatar.com/avatar/' + md5(user.email) + '?size=' + size,
        size: size
    };

    return _.omit(user, 'email');
}

function mapListToView(users, size) {
    return _.map(users, function (user) {
        return mapToView(user, size);
    });
}

module.exports = {
    mapToView: mapToView,
    mapListToView: mapListToView
};