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

function returnResourceIfExists(resource, reply, err) {
    if (resource) {
        reply(resource);
    } else if (err.notFound) {
        reply().code(404);
    }
}

function defineListRouteFor(resourceType, controller) {
    return {
        method: 'GET',
        path: '/' + resourceType,
        handler: function (request, reply) {
            controller.getList(function listResponse(err, data) {
                reply(data);
            });
        },
        config: {
            tags: ['api'],
            plugins: {
                hal: configureHalaciousFor(resourceType)
            }
        }
    };
}

function addRoutesTo(server) {
    server.route(defineListRouteFor('users', usersController));
    server.route(defineListRouteFor('rides', ridesController));

    server.route({
        method: 'GET',
        path: '/users/{id}',
        handler: function (request, reply) {
            usersController.getUser(request.params.id, function (err, user) {
                returnResourceIfExists(user, reply, err);
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
        path: '/rides/{id}',
        handler: function (request, reply) {
            ridesController.getRide(parseInt(request.params.id, 10), function (err, ride) {
                returnResourceIfExists(ride, reply, err);
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
}

module.exports = {
    addRoutesTo: addRoutesTo
};