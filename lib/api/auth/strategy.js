'use strict';

const
    apps = require('./apps'),
    grants = require('./grants');

exports.register = function (server, options, next) {
    server.auth.strategy('oz', 'oz', 'optional', {
        oz: {
            encryptionPassword: 'password',
            loadAppFunc: apps.getById,
            loadGrantFunc: grants.getById
        }
    });

    next();
};

exports.register.attributes = {
    name: 'auth-strategy',
    dependencies: 'scarecrow'
};
