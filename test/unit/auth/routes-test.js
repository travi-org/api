import Boom from 'boom';
import sinon from 'sinon';
import {assert} from 'chai';
import * as any from '@travi/any';
import {register} from '../../../lib/auth/routes';

suite('auth routes', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(Boom, 'unauthorized');
  });

  teardown(() => {
    sandbox.restore();
  });

  test('that the plugin is defined', () => {
    assert.deepEqual(register.attributes, {
      name: 'authentication-routes'
    });
  });

  test('that the login route is defined', () => {
    const next = sinon.spy();
    const reply = {view: sinon.spy()};
    const profile = any.simpleObject();
    const server = {
      route: sinon.stub()
    };
    const request = {
      auth: {
        isAuthenticated: true,
        credentials: {
          profile,
          query: {}
        }
      },
      cookieAuth: {
        set: sinon.spy()
      }
    };
    server.route.withArgs(sinon.match({path: '/login'})).yieldsTo('handler', request, reply);

    register(server, null, next);

    assert.calledWith(server.route, sinon.match({
      method: ['GET', 'POST'],
      path: '/login',
      config: {
        auth: 'auth0'
      }
    }));
    assert.calledWith(request.cookieAuth.set, request.auth.credentials);
    assert.calledWith(reply.view, 'login', {profile});
    assert.calledOnce(next);
  });

  test('that proper error is raised when authentication fails', () => {
    const error = any.simpleObject();
    const message = any.string();
    const reply = sinon.spy();
    const server = {
      route: sinon.stub()
    };
    server.route.withArgs(sinon.match({path: '/login'})).yieldsTo('handler', {
      auth: {
        isAuthenticated: false,
        error: {message}
      }
    }, reply);
    Boom.unauthorized.withArgs(`Authentication failed due to: ${message}`).returns(error);

    register(server, null, sinon.spy());

    assert.calledWith(reply, error);
  });

  test('that request is redirected to original route when login not loaded directly', () => {
    const originalRoute = any.string();
    const reply = {redirect: sinon.spy()};
    const profile = any.simpleObject();
    const server = {
      route: sinon.stub()
    };
    const request = {
      auth: {
        isAuthenticated: true,
        credentials: {
          profile,
          query: {
            next: originalRoute
          }
        }
      },
      cookieAuth: {
        set: sinon.spy()
      }
    };
    server.route.withArgs(sinon.match({path: '/login'})).yieldsTo('handler', request, reply);

    register(server, null, sinon.spy());

    assert.calledWith(reply.redirect, originalRoute);
  });

  test('that the scopes route is defined', () => {
    const next = sinon.spy();
    const reply = {view: sinon.spy()};
    const server = {
      route: sinon.stub()
    };
    server.route.withArgs(sinon.match({path: '/scopes'})).yieldsTo('handler', {}, reply);

    register(server, null, next);

    assert.calledWith(server.route, sinon.match({
      method: 'GET',
      path: '/scopes',
      config: {
        auth: 'session'
      }
    }));
    assert.calledWith(reply.view, 'scopes');
  });
});
