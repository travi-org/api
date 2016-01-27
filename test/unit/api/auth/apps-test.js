'use strict';

const
    any = require('../../../helpers/any'),
    proxyquire = require('proxyquire');

suite('application authorization', function () {
    const
        appName = any.string(),
        app = any.simpleObject(),
        apps = proxyquire('../../../../lib/api/auth/apps', {
            '../../../data/auth/apps': {
                [appName]: app
            }
        });

    test('that app is retrieved by id', function () {
        var callback = sinon.spy();

        apps.getById(appName, callback);

        assert.calledWith(callback, null, app);
    });
});