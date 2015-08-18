'use strict';

var path = require('path'),
    any = require(path.join(__dirname, '../../helpers/any-for-api')),
    Joi = require('joi'),
    _ = require('lodash'),
    router = require(path.join(__dirname, '../../../lib/router')),
    controller = require(path.join(__dirname, '../../../lib/rides/controller'));

suite('ride router', function () {
    var handlers = {},
        prepare,
        server = {route: function () {
            return;
        }};

    setup(function () {
        sinon.stub(server, 'route', function (definition) {
            if (definition.path === '/rides') {
                handlers.list = definition.handler;
                prepare = definition.config.plugins.hal.prepare;
            } else if (definition.path === '/rides/{id}') {
                handlers.ride = definition.handler;
            }
        });
    });

    teardown(function () {
        server.route.restore();
        handlers = {};
        prepare = null;
    });

    suite('list route', function () {
        setup(function () {
            sinon.stub(controller, 'getList');
        });

        teardown(function () {
            controller.getList.restore();
        });

        test('that list route defined correctly', function () {
            router.addRoutesTo(server);

            assert.calledWith(server.route, sinon.match({
                method: 'GET',
                path: '/rides',
                config: {
                    tags: ['api'],
                    plugins: {
                        hal: {
                            api: 'rides'
                        }
                    }
                }
            }));
        });

        test('that the list route gets gets data from controller', function () {
            var reply = sinon.spy(),
                data = {foo: 'bar'};
            controller.getList.yields(null, data);
            router.addRoutesTo(server);

            handlers.list(null, reply);

            assert.calledWith(reply, data);
        });

        test('that list is formatted to meet hal spec', function () {
            var next = sinon.spy(),
                rep = {
                    entity: {
                        rides: [
                            {id: any.int()},
                            {id: any.int()},
                            {id: any.int()}
                        ]
                    },
                    embed: sinon.spy(),
                    ignore: sinon.spy()
                };
            router.addRoutesTo(server);

            prepare(rep, next);

            sinon.assert.callCount(rep.embed, rep.entity.rides.length);
            _.each(rep.entity.rides, function (ride) {
                assert.calledWith(rep.embed, 'rides', './' + ride.id, ride);
            });
            assert.calledWith(rep.ignore, 'rides');
            assert.calledOnce(next);
        });
    });

    suite('ride route', function () {
        setup(function () {
            sinon.stub(controller, 'getRide');
        });

        teardown(function () {
            controller.getRide.restore();
        });

        test('that individual route defined correctly', function () {
            router.addRoutesTo(server);

            assert.calledWith(server.route, sinon.match({
                method: 'GET',
                path: '/rides/{id}',
                config: {
                    tags: ['api'],
                    validate: {
                        params: {
                            id: Joi.string().required()
                        }
                    }
                }
            }));
        });

        test('that ride returned from controller', function () {
            var id = any.int(),
                reply = sinon.spy(),
                ride = {id: id};
            controller.getRide.withArgs(id).yields(null, ride);
            router.addRoutesTo(server);

            handlers.ride({params: {id: id}}, reply);

            assert.calledWith(reply, ride);
        });

        test('that 404 returned when ride does not exist', function () {
            var id = any.int(),
                setContentType = sinon.spy(),
                setResponseCode = sinon.stub().returns({type: setContentType}),
                reply = sinon.stub().withArgs().returns({code: setResponseCode});
            controller.getRide.withArgs(id).yields({notFound: true}, null);
            router.addRoutesTo(server);

            handlers.ride({params: {id: id}}, reply);

            assert.calledWith(reply, {
                _links: {
                    profile: {
                        href: 'http://nocarrier.co.uk/profiles/vnd.error/'
                    }
                },
                message: 'Not Found'
            });
            assert.calledWith(setResponseCode, 404);
            assert.calledWith(
                setContentType,
                'application/hal+json; profile="http://nocarrier.co.uk/profiles/vnd.error/"'
            );
        });
    });
});