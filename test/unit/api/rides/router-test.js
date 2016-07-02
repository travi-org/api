import any from '../../../helpers/any-for-api';
import Joi from 'joi';
import deepFreeze from 'deep-freeze';
import router from '../../../../lib/api/router';
import controller from '../../../../lib/api/rides/controller';
import * as errorMapper from '../../../../lib/api/error-response-mapper';

suite('ride router', () => {
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
            if ('/rides' === definition.path) {
                handlers.list = definition.handler;
                prepare = definition.config.plugins.hal.prepare;
            } else if ('/rides/{id}' === definition.path) {
                handlers.ride = definition.handler;
            }
        });
        sinon.stub(errorMapper, 'mapToResponse');
    });

    teardown(() => {
        errorMapper.mapToResponse.restore();
        server.route.restore();
        handlers = {};
        prepare = null;
    });

    suite('list route', () => {
        setup(() => {
            sinon.stub(controller, 'getList');
        });

        teardown(() => {
            controller.getList.restore();
        });

        test('that list route defined correctly', () => {
            const next = sinon.spy();
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

        test('that the list route gets gets data from controller', () => {
            const
                reply = sinon.spy(),
                data = {foo: 'bar'};
            controller.getList.yields(null, data);
            router.register(server, null, sinon.spy());

            handlers.list(requestNoAuth, reply);

            assert.calledWith(reply, data);
        });

        test('that scopes are passed to controller for request with authorization', () => {
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
                        rides: [
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

            sinon.assert.callCount(rep.embed, rep.entity.rides.length);
            rep.entity.rides.forEach((ride) => {
                assert.calledWith(rep.embed, 'rides', `./${ride.id}`, ride);
            });
            assert.calledWith(rep.ignore, 'rides');
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

    suite('ride route', () => {
        setup(() => {
            sinon.stub(controller, 'getRide');
        });

        teardown(() => {
            controller.getRide.restore();
        });

        test('that individual route defined correctly', () => {
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

        test('that ride returned from controller', () => {
            const
                id = any.integer(),
                reply = sinon.spy(),
                ride = {id};
            controller.getRide.withArgs(id).yields(null, ride);
            router.register(server, null, sinon.spy());

            handlers.ride({params: {id}}, reply);

            assert.calledWith(reply, ride);
        });

        test('that error mapped when ride request results in error', () => {
            const
                id = any.integer(),
                setContentType = sinon.spy(),
                setResponseCode = sinon.stub().returns({type: setContentType}),
                reply = sinon.stub().withArgs().returns({code: setResponseCode}),
                err = {notFound: true};
            controller.getRide.withArgs(id).yields(err, null);
            router.register(server, null, sinon.spy());

            handlers.ride({params: {id}}, reply);

            assert.calledWith(errorMapper.mapToResponse, err, reply);
        });
    });
});
