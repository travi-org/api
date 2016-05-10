'use strict';

const
    path = require('path'),
    any = require(path.join(__dirname, '../../../helpers/any-for-api')),

    controller = require(path.join(__dirname, '../../../../lib/api/rides/controller')),
    repo = require(path.join(__dirname, '../../../../lib/api/rides/repository'));

suite('rides controller', () => {
    const
        list = ['foo', 'bar'],
        error = any.string();

    setup(() => {
        sinon.stub(repo, 'getList');
        sinon.stub(repo, 'getRide');
    });

    teardown(() => {
        repo.getList.restore();
        repo.getRide.restore();
    });

    test('that list is returned from repository', () => {
        const callback = sinon.spy();
        repo.getList.yields(null, list);

        controller.getList(undefined, callback);

        assert.calledWith(callback, null, { rides: list });
    });

    test('that error bubbles for list request', () => {
        const callback = sinon.spy();
        repo.getList.yields(error);

        controller.getList(undefined, callback);

        assert.calledOnceWith(callback, error);
    });

    test('that not-found error returned for non-existent ride', () => {
        const
            id = any.integer(),
            callback = sinon.spy();
        repo.getRide.withArgs(id).yields(null, null);

        controller.getRide(id, callback);

        assert.calledWith(callback, {notFound: true});
    });

    test('that ride returned from repository', () => {
        const
            id = any.integer(),
            callback = sinon.spy(),
            ride = {id};
        repo.getRide.withArgs(id).yields(null, ride);

        controller.getRide(id, callback);

        assert.calledWith(callback, null, ride);
    });

    test('that error bubbles for ride request', () => {
        const
            id = any.integer(),
            callback = sinon.spy();
        repo.getRide.yields(error);

        controller.getRide(id, callback);

        assert.calledWith(callback, error);
    });
});
