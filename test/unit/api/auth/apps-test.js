import * as any from '@travi/any';
import proxyquire from 'proxyquire';

suite('application authorization', () => {
    const
        appName = any.string(),
        app = any.simpleObject(),
        apps = proxyquire('../../../../lib/api/auth/apps', {
            '../../../data/auth/apps': {
                [appName]: app
            }
        }).default;

    test('that app is retrieved by id', () => {
        const callback = sinon.spy();

        apps.getById(appName, callback);

        assert.calledWith(callback, null, app);
    });
});
