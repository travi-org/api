import * as any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import proxyquire from 'proxyquire';

suite('application authorization', () => {
  const appName = any.string();
  const app = any.simpleObject();
  const apps = proxyquire('../../../../lib/api/auth/apps', {
    '../../../data/auth/apps.json': {
      [appName]: app
    }
  }).default;

  test('that app is retrieved by id', () => {
    const callback = sinon.spy();

    apps.getById(appName, callback);

    assert.calledWith(callback, null, app);
  });
});
