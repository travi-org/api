'use strict';

var any = require('./any');

any.resource = function () {
    return {};
};

any.resources = {
    ride: function () {
        return {
            id: any.int(),
            nickname: any.string()
        };
    },
    user: function () {
        return {
            id: any.string(),
            'first-name': any.string(),
            'last-name': any.string(),
            email: any.email()
        };
    }
};

module.exports = any;
