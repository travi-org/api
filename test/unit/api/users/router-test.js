'use strict';

var path = require('path'),
    any = require(path.join(__dirname, '../../../helpers/any-for-api')),
    _ = require('lodash'),
    Joi = require('joi'),
    router = require(path.join(__dirname, '../../../../lib/api/router')),
    controller = require(path.join(__dirname, '../../../../lib/api/users/controller')),
    errorMapper = require(path.join(__dirname, '../../../../lib/api/error-response-mapper'));

suite('user router', function () {
    var handlers = {},
        prepare,
        server = {route: function () {
            return;
        }};

    setup(function () {
        sinon.stub(server, 'route', function (definition) {
            if (definition.path === '/users') {
                handlers.list = definition.handler;
                prepare = definition.config.plugins.hal.prepare;
            } else if (definition.path === '/users/{id}') {
                handlers.user = definition.handler;
            }
        });
        sinon.stub(errorMapper, 'mapToResponse');
    });

    teardown(function () {
        errorMapper.mapToResponse.restore();
        server.route.restore();
        prepare = null;
        handlers = {};
    });

    suite('list route', function () {
        setup(function () {
            sinon.stub(controller, 'getList');
        });

        teardown(function () {
            controller.getList.restore();
        });

        test('that list route defined correctly', function () {
            router.register(server, null, sinon.spy());

            assert.calledWith(server.route, sinon.match({
                method: 'GET',
                path: '/users',
                config: {
                    tags: ['api'],
                    plugins: {
                        hal: {
                            api: 'users'
                        }
                    }
                }
            }));
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
                        users: [
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

            sinon.assert.callCount(rep.embed, rep.entity.users.length);
            _.each(rep.entity.users, function (user) {
                assert.calledWith(rep.embed, 'users', './' + user.id, user);
            });
            assert.calledWith(rep.ignore, 'users');
            assert.calledOnce(next);
        });

        test('that error mapped when list request results in error', function () {
            var reply = sinon.spy(),
                err = {};
            router.register(server, null, sinon.spy());
            controller.getList.yields(err);

            handlers.list(null, reply);

            assert.calledWith(errorMapper.mapToResponse, err, reply);
            refute.called(reply);
        });
    });

    suite('user route', function () {
        setup(function () {
            sinon.stub(controller, 'getUser');
        });

        teardown(function () {
            controller.getUser.restore();
        });

        test('that individual route defined correctly', function () {
            router.register(server, null, sinon.spy());

            assert.calledWith(server.route, sinon.match({
                method: 'GET',
                path: '/users/{id}',
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

        test('that user returned from controller', function () {
            var id = any.int(),
                reply = sinon.spy(),
                user = {id: id};
            controller.getUser.withArgs(id).yields(null, user);
            router.register(server, null, sinon.spy());

            handlers.user({params: {id: id}}, reply);

            assert.calledWith(reply, user);
        });

        test('that 404 returned when user does not exist', function () {
            var id = any.int(),
                setContentType = sinon.spy(),
                setResponseCode = sinon.stub().returns({type: setContentType}),
                reply = sinon.stub().withArgs().returns({code: setResponseCode}),
                err = {notFound: true};
            controller.getUser.withArgs(id).yields(err, null);
            router.register(server, null, sinon.spy());

            handlers.user({params: {id: id}}, reply);

            assert.calledWith(errorMapper.mapToResponse, err, reply);
        });
    });
});