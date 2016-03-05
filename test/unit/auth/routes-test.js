'use strict';

const
    routes = require('../../../lib/auth/routes'),
    Boom = require('boom'),

    any = require('../../helpers/any');

suite('auth routes', () => {
    let sandbox;

    setup(() => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(Boom, 'unauthorized');
    });

    teardown(() => {
        sandbox.restore();
    });

    test('that the plugin is defined', () => {
        assert.equals(routes.register.attributes, {
            name: 'authentication-routes'
        });
    });

    test('that the login route is defined', () => {
        const
            next = sinon.spy(),
            reply = {view: sinon.spy()},
            profile = any.simpleObject(),
            server = {
                route: sinon.stub().yieldsTo('handler', {
                    auth: {
                        isAuthenticated: true,
                        credentials: {profile}
                    }
                }, reply)
            };

        routes.register(server, null, next);

        assert.calledWith(server.route, sinon.match({
            method: ['GET', 'POST'],
            path: '/login',
            config: {
                auth: 'auth0'
            }
        }));
        assert.calledWith(reply.view, 'login', {profile});
        assert.calledOnce(next);
    });

    test('that proper error is raised when authentication fails', () => {
        const
            error = any.simpleObject(),
            message = any.string(),
            reply = sinon.spy(),
            server = {
                route: sinon.stub().yieldsTo('handler', {
                    auth: {
                        isAuthenticated: false,
                        error: {message}
                    }
                }, reply)
            };
        Boom.unauthorized.withArgs(`Authentication failed due to: ${message}`).returns(error);

        routes.register(server, null, sinon.spy());

        assert.calledWith(reply, error);
    });
});
