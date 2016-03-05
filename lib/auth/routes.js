'use strict';

const Boom = require('boom');

exports.register = function (server, options, next) {
    server.route({
        method: ['GET', 'POST'],
        path: '/login',
        config: {
            auth: 'auth0'
        },
        handler(request, reply) {
            if (!request.auth.isAuthenticated) {
                reply(Boom.unauthorized(`Authentication failed due to: ${request.auth.error.message}`));
            } else {
                reply.view('login', {
                    profile: request.auth.credentials.profile
                });
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'authentication-routes'
};
