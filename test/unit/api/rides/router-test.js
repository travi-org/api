'use strict';

var path = require('path'),
    any = require(path.join(__dirname, '../../../helpers/any-for-api')),
    Joi = require('joi'),
    _ = require('lodash'),
    router = require(path.join(__dirname, '../../../../lib/api/router')),
    controller = require(path.join(__dirname, '../../../../lib/api/rides/controller')),
    errorMapper = require(path.join(__dirname, '../../../../lib/api/error-response-mapper'));

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
            var next = sinon.spy();
            router.register(server, null, next);

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
            assert.calledOnce(next);
        });

        test('that the list route gets gets data from controller', function () {
            var reply = sinon.spy(),
                data = {foo: 'bar'};
            controller.getList.yields(null, data);
            router.register(server, null, sinon.spy());

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
            router.register(server, null, sinon.spy());

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
            sinon.stub(errorMapper, 'mapToResponse');
        });

        teardown(function () {
            controller.getRide.restore();
            errorMapper.mapToResponse.restore();
        });

        test('that individual route defined correctly', function () {
            router.register(server, null, sinon.spy());

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
            router.register(server, null, sinon.spy());

            handlers.ride({params: {id: id}}, reply);

            assert.calledWith(reply, ride);
        });

        test('that 404 returned when ride does not exist', function () {
            var id = any.int(),
                setContentType = sinon.spy(),
                setResponseCode = sinon.stub().returns({type: setContentType}),
                reply = sinon.stub().withArgs().returns({code: setResponseCode}),
                err = {notFound: true};
            controller.getRide.withArgs(id).yields(err, null);
            router.register(server, null, sinon.spy());

            handlers.ride({params: {id: id}}, reply);

            assert.calledWith(errorMapper.mapToResponse, err, reply);
        });
    });
});