import proxyquire from 'proxyquire';
import * as any from '@travi/any';

suite('api authorization', () => {
    const
        grantList = any.listOf(any.simpleObject),
        grants = proxyquire('../../../../lib/api/auth/grants', {
            '../../../data/auth/grants': grantList
        }).default;

    test('that grant is retrieved by id', () => {
        const
            callback = sinon.spy(),
            grantId = any.integer(grantList.length - 1);

        grants.getById(grantId, callback);

        assert.calledWith(callback, null, grantList[grantId]);
    });
});
