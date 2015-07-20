'use strict';

var hapi = require('hapi'),
    halacious = require('halacious'),
    fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    Joi = require('joi'),

    userMapper = require(path.join(__dirname, 'lib/mappers/user-mapper')),

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
    path: '/rides',
    config: {
        handler: function (request, response) {
            fs.readFile(path.join(__dirname, 'data/rides.json'), 'utf8', function (err, content) {
                response({ rides: JSON.parse(content)});
            });
        },
        tags: ['api'],
        plugins: {
            hal: { api: 'rides'}
        }
    }
});

api.route({
    method: 'GET',
    path: '/rides/{id}',
    config: {
        handler: function (request, response) {
            fs.readFile(path.join(__dirname, 'data/rides.json'), 'utf8', function (err, content) {
                var rideId = request.params.id;

                if (_.contains(JSON.parse(content), rideId)) {
                    response({ride: rideId});
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
    path: '/users',
    config: {
        handler: function (request, response) {
            fs.readFile(path.join(__dirname, 'data/users.json'), 'utf8', function (err, content) {
                response({ users: userMapper.mapListToView(JSON.parse(content))});
            });
        },
        tags: ['api'],
        plugins: {
            hal: { api: 'users'}
        }
    }
});

api.route({
    method: 'GET',
    path: '/users/{id}',
    config: {
        handler: function (request, response) {
            fs.readFile(path.join(__dirname, 'data/users.json'), 'utf8', function (err, content) {
                var user = _.find(JSON.parse(content), _.matchesProperty('id', request.params.id));

                if (user) {
                    response(userMapper.mapToView(user));
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

if (!module.parent) {
    api.start(function (err) {
        if (err) {
            return console.error(err);
        }

        api.log('Server started', api.info.uri);
    });
}

module.exports = api;
