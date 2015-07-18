'use strict';

var md5 = require('MD5'),
    _ = require('lodash');

function mapToView(user) {
    user.avatar = 'https://www.gravatar.com/avatar/' + md5(user.email);

    return _.omit(user, 'email');
}

module.exports = {
    mapToView: mapToView
};