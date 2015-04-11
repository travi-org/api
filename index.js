'use strict';

var hapi = require("hapi");

var api = new hapi.Server();
api.connection({ port: 3000 });

api.route({
    method: 'GET',
    path: '/',
    handler: function (request, response) {
        response();
    }
});

module.exports = api;
