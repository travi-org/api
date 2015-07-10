'use strict';

var hapi = require('hapi'),
    halacious = require('halacious'),
    fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    md5 = require('MD5'),

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
    path: '/users',
    config: {
        handler: function (request, response) {
            fs.readFile(path.join(__dirname, 'data/users.json'), 'utf8', function (err, content) {
                response({ users: _.map(JSON.parse(content), function (user) {
                    user.avatar = 'https://www.gravatar.com/avatar/' + md5(user.email);

                    return _.omit(user, 'email');
                })});
            });
        },
        tags: ['api'],
        plugins: {
            hal: { api: 'users'}
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
