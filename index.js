'use strict';

var hapi = require('hapi'),
    halacious = require('halacious'),
    path = require('path'),
    Joi = require('joi'),

    userMapper = require(path.join(__dirname, 'lib/users/mapper')),
    router = require('./lib/router'),

    api = new hapi.Server(),
    port = process.env.OPENSHIFT_NODEJS_PORT || 3000,
    address = process.env.OPENSHIFT_NODEJS_IP || 'localhost';

api.connection({
    port: port,
    address: address,
    labels: ['api']
});

api.register({
    register: halacious,
    options: {
        apiPath: '',
        absolute: true,
        strict: true
    }
}, function (err) {
    if (err) {
        console.log(err);
    }
});

api.register({
    register: require('hapi-swaggered'),
    options: {
        info: {
            title: 'Travi API',
            version: '1.0'
        }
    }
}, function (err) {
    if (err) {
        api.log(['error'], 'hapi-swagger load error: ' + err);
    } else {
        api.log(['start'], 'hapi-swagger interface loaded');
    }
});

api.register(
    { register: require('hapi-swaggered-ui') },
    {
        select: 'api',
        routes: {
            prefix: '/documentation'
        }
    },
    function (err) {
        if (err) {
            throw err;
        }
    }
);

api.route({
    method: 'GET',
    path: '/rides/{id}',
    config: {
        handler: function (request, response) {
            require('./lib/rides/repository').getRide(parseInt(request.params.id, 10), function (err, ride) {
                if (ride) {
                    response(ride);
                } else {
                    response().code(404);
                }
            });
        },
        tags: ['api'],
        validate: {
            params: {
                id: Joi.string().required()
            }
        }
    }
});

api.route({
    method: 'GET',
    path: '/users/{id}',
    config: {
        handler: function (request, response) {
            require('./lib/users/controller').getUser(request.params.id, function (err, user) {
                if (user) {
                    response(user);
                } else if (err.notFound) {
                    response().code(404);
                }
            });
        },
        tags: ['api'],
        validate: {
            params: {
                id: Joi.string().required()
            }
        }
    }
});

router.addRoutesTo(api);

if (!module.parent) {
    api.start(function (err) {
        if (err) {
            return console.error(err);
        }

        api.log('Server started', api.info.uri);
    });
}

module.exports = api;
