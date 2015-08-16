'use strict';

var path = require('path'),
    _ = require('lodash'),
    usersController = require(path.join(__dirname, './users/controller')),
    ridesController = require(path.join(__dirname, './rides/controller'));

function addRoutes(server) {
    server.route({
        method: 'GET',
        path: '/users',
        handler: function (request, reply) {
            usersController.getList(function (err, data) {
                reply(data);
            });
        },
        config: {
            tags: ['api'],
            plugins: {
                hal: {
                    api: 'users',
                    prepare: function (rep, next) {
                        _.each(rep.entity.users, function (user) {
                            rep.embed('users', './' + user.id, user);
                        });

                        rep.ignore('users');

                        next();
                    }
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
                hal: {
                    api: 'rides',
                    prepare: function (rep, next) {
                        _.each(rep.entity.rides, function (ride) {
                            rep.embed('rides', './' + ride.id, ride);
                        });

                        rep.ignore('rides');

                        next();
                    }
                }
            }
        }
    });
}

module.exports = {
    addRoutesTo: addRoutes
};