'use strict';

var hapi = require('hapi'),
    halacious = require('halacious');

var api = new hapi.Server();
api.connection({ port: 3000 });

api.register({
    register: halacious,
    options: {
        apiPath: ''
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
    path: '/hello',
    config: {
        handler: function (request, response) {
            response({message: 'Hello World'});
        },
        plugins: {
            hal: {
                api: 'hello'
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
