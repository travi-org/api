'use strict';

const
    proxyquire = require('proxyquire'),
    any = require('../../../helpers/any');

suite('api authorization', () => {
    const
        grantList = any.listOf(any.simpleObject),
        grants = proxyquire('../../../../lib/api/auth/grants', {
            '../../../data/auth/grants': grantList
        });

    test('that grant is retrieved by id', () => {
        const
            callback = sinon.spy(),
            grantId = any.int(grantList.length - 1);

        grants.getById(grantId, callback);

        assert.calledWith(callback, null, grantList[grantId]);
    });
});
