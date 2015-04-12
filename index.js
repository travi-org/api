'use strict';

var hapi = require('hapi'),
    halacious = require('halacious');

var api = new hapi.Server();
api.connection({ port: 3000 });
api.register(halacious, function (err) {
    if (err) {
        console.log(err);
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
