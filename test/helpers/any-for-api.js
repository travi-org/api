'use strict';

const any = require('@travi/any');

any.resource = function () {
    return any.simpleObject();
};

any.resources = {
    ride() {
        return {
            id: any.integer(),
            nickname: any.string()
        };
    },
    user() {
        return {
            id: any.word(),
            'first-name': any.string(),
            'last-name': any.string(),
            email: any.email()
        };
    }
};

module.exports = any;
