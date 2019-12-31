import * as any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import {register} from '../../../lib/auth/strategy';

suite('authentication strategy', () => {
  teardown(() => {
    process.env.AUTH0_CLIENT_ID = null;
    process.env.AUTH0_CLIENT_SECRET = null;
    process.env.AUTH_COOKIE_ENCRYPTION_PASSWORD = null;
  });

  test('that the plugin is defined', () => {
    assert.deepEqual(register.attributes, {
      name: 'authentication-strategy',
      dependencies: ['bell', 'hapi-auth-cookie']
    });
  });

  test('that the authentication and session strategies are registered', () => {
    const next = sinon.spy();
    const strategy = sinon.spy();
    const secure = true;
    const password = any.string();
    const clientId = any.string();
    const clientSecret = any.string();
    process.env.AUTH0_CLIENT_ID = clientId;
    process.env.AUTH0_CLIENT_SECRET = clientSecret;
    process.env.AUTH_COOKIE_ENCRYPTION_PASSWORD = password;

    register({auth: {strategy}}, {secure}, next);

    assert.calledWith(strategy, 'auth0', 'bell', {
      provider: 'auth0',
      clientId,
      clientSecret,
      password,
      config: {
        domain: 'travi.auth0.com'
      },
      forceHttps: secure,
      isSecure: secure
    });
    assert.calledWith(strategy, 'session', 'cookie', {
      password,
      redirectTo: '/login',
      appendNext: true,
      isSecure: secure
    });
    assert.calledOnce(next);
  });
});
