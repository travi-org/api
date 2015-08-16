'use strict';

var path = require('path'),
    controller = require(path.join(__dirname, '../../../lib/rides/controller')),

    repo = require(path.join(__dirname, '../../../lib/rides/repository')),

    list = ['foo', 'bar'];

suite('rides controller', function () {
    setup(function () {
        sinon.stub(repo, 'getList').yields(null, list);
    });

    teardown(function () {
        repo.getList.restore();
    });

    test('that list is returned from repository', function () {
        var callback = sinon.spy();

        controller.getList(callback);

        assert.calledWith(callback, null, { rides: list });
    });
});