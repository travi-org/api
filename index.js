'use strict';

var hapi = require('hapi');

var api = new hapi.Server();
api.connection({ port: 3000 });

api.route({
    method: 'GET',
    path: '/',
    handler: function (request, response) {
        response();
    }
});

if (!module.parent) {
    api.start(function (err) {
        if (err) return console.log(err);
        api.log('Server started', api.info.uri);
    });
}

module.exports = api;
