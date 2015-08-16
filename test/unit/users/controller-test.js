'use strict';

var path = require('path'),
    any = require(path.join(__dirname, '../../helpers/any-for-api')),
    controller = require(path.join(__dirname, '../../../lib/users/controller')),
    mapper = require(path.join(__dirname, '../../../lib/users/mapper')),
    repo = require(path.join(__dirname, '../../../lib/users/repository')),

    viewList = ['view-foo', 'view-bar'];

suite('users controller', function () {
    setup(function () {
        var list = ['foo', 'bar'];

        sinon.stub(repo, 'getList').yields(null, list);
        sinon.stub(mapper, 'mapListToView').withArgs(list, 32).returns(viewList);

        sinon.stub(repo, 'getUser');
        sinon.stub(mapper, 'mapToView');
    });

    teardown(function () {
        repo.getList.restore();
        mapper.mapListToView.restore();

        repo.getUser.restore();
        mapper.mapToView.restore();
    });

    test('that list is returned from repository', function () {
        var callback = sinon.spy();

        controller.getList(callback);

        assert.calledWith(callback, null, { users: viewList });
    });

    test('that not-found error returned for non-existent user', function () {
        var id = any.int(),
            callback = sinon.spy();
        repo.getUser.withArgs(id).yields(null, null);

        controller.getUser(id, callback);

        assert.calledWith(callback, {notFound: true});
    });

    test('that user returned from repository', function () {
        var id = any.int(),
            callback = sinon.spy(),
            user = {id: id},
            userView = {view: true};
        repo.getUser.withArgs(id).yields(null, user);
        mapper.mapToView.withArgs(user, 320).returns(userView);

        controller.getUser(id, callback);

        assert.calledWith(callback, null, userView);
    });
});