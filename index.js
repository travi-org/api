'use strict';

var hapi = require('hapi'),
    halacious = require('halacious'),
    fs = require('fs'),
    _ = require('lodash'),

    api = new hapi.Server(),
    port = process.env.OPENSHIFT_NODEJS_PORT || 3000,
    address = process.env.OPENSHIFT_NODEJS_IP || 'localhost';

api.connection({
    port: port,
    address: address
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
    register: require('hapi-swagger')
}, function (err) {
    if (err) {
        api.log(['error'], 'hapi-swagger load error: ' + err);
    } else {
        api.log(['start'], 'hapi-swagger interface loaded');
    }
});

api.route({
    method: 'GET',
    path: '/rides',
    config: {
        handler: function (request, response) {
            fs.readFile('data/rides.json', 'utf8', function (err, content) {
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
            fs.readFile('./data/users.json', 'utf8', function (err, content) {
                response({ users: _.map(JSON.parse(content), function (user) {
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
