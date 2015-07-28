'use strict';

var md5 = require('MD5'),
    _ = require('lodash');

function mapToView(user) {
    user.avatar = 'https://www.gravatar.com/avatar/' + md5(user.email) + '?size=32';

    return _.omit(user, 'email');
}

function mapListToView(users) {
    return _.map(users, mapToView);
}

module.exports = {
    mapToView: mapToView,
    mapListToView: mapListToView
};