'use strict';

const any = require('./any');

any.resource = function () {
    return {};
};

any.resources = {
    ride() {
        return {
            id: any.int(),
            nickname: any.string()
        };
    },
    user() {
        return {
            id: any.string(),
            'first-name': any.string(),
            'last-name': any.string(),
            email: any.email()
        };
    }
};

module.exports = any;
