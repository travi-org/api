const
    path = require('path'),
    any = require(path.join(__dirname, '../../../helpers/any-for-api')),
    _ = require('lodash'),
    Joi = require('joi'),
    deepFreeze = require('deep-freeze'),
    router = require(path.join(__dirname, '../../../../lib/api/router')),
    controller = require(path.join(__dirname, '../../../../lib/api/users/controller')),
    errorMapper = require(path.join(__dirname, '../../../../lib/api/error-response-mapper'));

suite('user router', () => {
    const requestNoAuth = deepFreeze({auth: {}}),
        server = {
            route() {
                return;
            }
        };
    let prepare,
        handlers = {};

    setup(() => {
        sinon.stub(server, 'route', (definition) => {
            if ('/users' === definition.path) {
                handlers.list = definition.handler;
                prepare = definition.config.plugins.hal.prepare;
            } else if ('/users/{id}' === definition.path) {
                handlers.user = definition.handler;
            }
        });
        sinon.stub(errorMapper, 'mapToResponse');
    });

    teardown(() => {
        errorMapper.mapToResponse.restore();
        server.route.restore();
        prepare = null;
        handlers = {};
    });

    suite('list route', () => {
        setup(() => {
            sinon.stub(controller, 'getList');
        });

        teardown(() => {
            controller.getList.restore();
        });

        test('that list route defined correctly', () => {
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

        test('that the list route gets gets data from controller', () => {
            const
                reply = sinon.spy(),
                data = {foo: 'bar'};
            controller.getList.yields(null, data);
            router.register(server, null, sinon.spy());

            handlers.list(requestNoAuth, reply);

            assert.calledWith(reply, data);
        });

        test('that scopes are passed to controller for list request with authorization', () => {
            const
                reply = sinon.spy(),
                scopes = any.listOf(any.string);
            router.register(server, null, sinon.spy());

            handlers.list({
                auth: {
                    credentials: {scope: scopes}
                }
            }, reply);

            assert.calledWith(controller.getList, scopes);
        });

        test('that list is formatted to meet hal spec', () => {
            const
                next = sinon.spy(),
                rep = {
                    entity: {
                        users: [
                            {id: any.integer()},
                            {id: any.integer()},
                            {id: any.integer()}
                        ]
                    },
                    embed: sinon.spy(),
                    ignore: sinon.spy()
                };
            router.register(server, null, sinon.spy());

            prepare(rep, next);

            sinon.assert.callCount(rep.embed, rep.entity.users.length);
            _.each(rep.entity.users, (user) => {
                assert.calledWith(rep.embed, 'users', `./${user.id}`, user);
            });
            assert.calledWith(rep.ignore, 'users');
            assert.calledOnce(next);
        });

        test('that error mapped when list request results in error', () => {
            const
                reply = sinon.spy(),
                err = {};
            router.register(server, null, sinon.spy());
            controller.getList.yields(err);

            handlers.list(requestNoAuth, reply);

            assert.calledWith(errorMapper.mapToResponse, err, reply);
            refute.called(reply);
        });
    });

    suite('user route', () => {
        setup(() => {
            sinon.stub(controller, 'getUser');
        });

        teardown(() => {
            controller.getUser.restore();
        });

        test('that individual route defined correctly', () => {
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

        test('that user returned from controller', () => {
            const
                id = any.integer(),
                reply = sinon.spy(),
                user = {id};
            controller.getUser.withArgs(id).yields(null, user);
            router.register(server, null, sinon.spy());

            handlers.user({
                params: {id},
                auth: requestNoAuth.auth
            }, reply);

            assert.calledWith(reply, user);
        });

        test('that scopes are passed to controller for request with authorization', () => {
            const
                id = any.integer(),
                reply = sinon.spy(),
                scopes = any.listOf(any.string);
            router.register(server, null, sinon.spy());

            handlers.user({
                params: {id},
                auth: {credentials: {scope: scopes}}
            }, reply);

            assert.calledWith(controller.getUser, id, scopes);
        });

        test('that 404 returned when user does not exist', () => {
            const
                id = any.integer(),
                setContentType = sinon.spy(),
                setResponseCode = sinon.stub().returns({type: setContentType}),
                reply = sinon.stub().withArgs().returns({code: setResponseCode}),
                err = {notFound: true};
            controller.getUser.withArgs(id).yields(err, null);
            router.register(server, null, sinon.spy());

            handlers.user({
                params: {id},
                auth: requestNoAuth.auth
            }, reply);

            assert.calledWith(errorMapper.mapToResponse, err, reply);
        });
    });
});
