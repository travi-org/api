const apps = require('./apps');

exports.register = function (server, options, next) {
    server.auth.strategy('oz', 'oz', 'optional', {
        oz: {
            encryptionPassword: 'password',
            loadAppFunc: apps.getById
        }
    });

    next();
};

exports.register.attributes = {
    name: 'auth-strategy',
    dependencies: 'scarecrow'
};