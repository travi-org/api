'use strict';

var path = require('path'),
    controller = require(path.join(__dirname, '../../../lib/users/controller')),
    mapper = require(path.join(__dirname, '../../../lib/users/mapper')),
    repo = require(path.join(__dirname, '../../../lib/users/repository')),

    viewList = ['view-foo', 'view-bar'];

suite('users controller', function () {
    setup(function () {
        var list = ['foo', 'bar'];

        sinon.stub(repo, 'getList').yields(null, list);
        sinon.stub(mapper, 'mapListToView').withArgs(list, 32).returns(viewList);
    });

    teardown(function () {
        repo.getList.restore();
        mapper.mapListToView.restore();
    });

    test('that list is returned from repository', function () {
        var callback = sinon.spy();

        controller.getList(callback);

        assert.calledWith(callback, null, { users: viewList });
    });
});