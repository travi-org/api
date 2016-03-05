'use strict';

exports.register = function (server, options, next) {
    server.auth.strategy('auth0', 'bell', {
        provider: 'auth0',
        password: process.env.AUTH_COOKIE_ENCRYPTION_PASSWORD,
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        config: {
            domain: 'travi.auth0.com'
        },
        isSecure: !options.isLocal
    });

    next();
};

exports.register.attributes = {
    name: 'authentication-strategy',
    dependencies: 'bell'
};
