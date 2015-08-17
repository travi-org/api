'use strict';

var path = require('path'),
    _ = require('lodash'),
    Joi = require('joi'),
    usersController = require(path.join(__dirname, './users/controller')),
    ridesController = require(path.join(__dirname, './rides/controller'));

function configureHalaciousFor(resourceType) {
    return {
        api: resourceType,
        prepare: function (rep, next) {
            _.each(rep.entity[resourceType], function (resource) {
                rep.embed(resourceType, './' + resource.id, resource);
            });

            rep.ignore(resourceType);

            next();
        }
    };
}

function addRoutesTo(server) {
    server.route({
        method: 'GET',
        path: '/users',
        handler: function (request, reply) {
            usersController.getList(function listResponse(err, data) {
                reply(data);
            });
        },
        config: {
            tags: ['api'],
            plugins: {
                hal: configureHalaciousFor('users')
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/users/{id}',
        handler: function (request, reply) {
            usersController.getUser(request.params.id, function (err, user) {
                if (user) {
                    reply(user);
                } else if (err.notFound) {
                    reply().code(404);
                }
            });
        },
        config: {
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string().required()
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/rides',
        handler: function (request, reply) {
            ridesController.getList(function (err, data) {
                reply(data);
            });
        },
        config: {
            tags: ['api'],
            plugins: {
                hal: configureHalaciousFor('rides')
            }
        }
    });
}

module.exports = {
    addRoutesTo: addRoutesTo
};