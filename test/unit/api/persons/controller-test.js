import any from '../../../helpers/any-for-api';
import controller from '../../../../lib/api/persons/controller';
import mapper from '../../../../lib/api/persons/mapper';
import repo from '../../../../lib/api/persons/repository';

suite('users controller', () => {
    const
        largeAvatarSize = 320,
        viewList = ['view-foo', 'view-bar'],
        scopes = any.listOf(any.string),
        error = any.string();

    setup(() => {
        const
            avatarSize = 32,
            list = ['foo', 'bar'];

        sinon.stub(repo, 'getList').yields(null, list);

        sinon.stub(mapper, 'mapListToView').withArgs(list, avatarSize, scopes).returns(viewList);

        sinon.stub(repo, 'getPerson');
        sinon.stub(mapper, 'mapToView');
    });

    teardown(() => {
        repo.getList.restore();
        mapper.mapListToView.restore();

        repo.getPerson.restore();
        mapper.mapToView.restore();
    });

    test('that list is returned from repository', () => {
        const callback = sinon.spy();

        controller.getList(scopes, callback);

        assert.calledWith(callback, null, { persons: viewList });
    });

    test('that error bubbles for list request', () => {
        const callback = sinon.spy();
        repo.getList.yields(error);

        controller.getList(undefined, callback);

        assert.calledOnceWith(callback, error);
    });

    test('that not-found error returned for non-existent user', () => {
        const
            id = any.integer(),
            callback = sinon.spy();
        repo.getPerson.withArgs(id).yields(null, null);

        controller.getPerson(id, undefined, callback);

        assert.calledWith(callback, {notFound: true});
    });

    test('that user returned from repository', () => {
        const
            id = any.integer(),
            callback = sinon.spy(),
            user = {id},
            userView = {view: true};
        repo.getPerson.withArgs(id).yields(null, user);
        mapper.mapToView.withArgs(user, largeAvatarSize, scopes).returns(userView);

        controller.getPerson(id, scopes, callback);

        assert.calledWith(callback, null, userView);
    });

    test('that error bubbles for user request', () => {
        const
            id = any.integer(),
            callback = sinon.spy();
        repo.getPerson.yields(error);

        controller.getPerson(id, undefined, callback);

        assert.calledWith(callback, error);
    });
});
