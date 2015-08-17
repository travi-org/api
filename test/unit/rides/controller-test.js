'use strict';

var path = require('path'),
    any = require(path.join(__dirname, '../../helpers/any-for-api')),

    controller = require(path.join(__dirname, '../../../lib/rides/controller')),
    repo = require(path.join(__dirname, '../../../lib/rides/repository')),

    list = ['foo', 'bar'];

suite('rides controller', function () {
    setup(function () {
        sinon.stub(repo, 'getList').yields(null, list);
        sinon.stub(repo, 'getRide').yields(null, list);
    });

    teardown(function () {
        repo.getList.restore();
        repo.getRide.restore();
    });

    test('that list is returned from repository', function () {
        var callback = sinon.spy();

        controller.getList(callback);

        assert.calledWith(callback, null, { rides: list });
    });

    test('that not-found error returned for non-existent ride', function () {
        var id = any.int(),
            callback = sinon.spy();
        repo.getRide.withArgs(id).yields(null, null);

        controller.getRide(id, callback);

        assert.calledWith(callback, {notFound: true});
    });

    test('that ride returned from repository', function () {
        var id = any.int(),
            callback = sinon.spy(),
            ride = {id: id};
        repo.getRide.withArgs(id).yields(null, ride);

        controller.getRide(id, callback);

        assert.calledWith(callback, null, ride);
    });
});