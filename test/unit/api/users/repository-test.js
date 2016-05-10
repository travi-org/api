'use strict';

const
    path = require('path'),
    fs = require('fs'),
    any = require(path.join(__dirname, '../../../helpers/any-for-api')),
    repo = require(path.join(__dirname, '../../../../lib/api/users/repository'));

require('setup-referee-sinon/globals');

function setUpDataFile(data) {
    fs.readFile.withArgs(
        path.join(__dirname, '../../../../data/users.json'),
        'utf8'
    ).yields(null, JSON.stringify(data));
}

suite('user repository', () => {
    const error = any.string();

    setup(() => {
        sinon.stub(fs, 'readFile');
    });

    teardown(() => {
        fs.readFile.restore();
    });

    test('that list is loaded from a file', () => {
        const
            callback = sinon.spy(),
            data = {};
        setUpDataFile(data);

        repo.getList(callback);

        assert.calledWith(callback, null, data);
    });

    test('that error bubbles for failure to read the file for list', () => {
        const callback = sinon.spy();
        fs.readFile.yields(error);

        repo.getList(callback);

        assert.calledWith(callback, error);
    });

    test('that user is loaded from file', () => {
        const
            id = any.integer(),
            callback = sinon.spy(),
            user = { id },
            data = [user];
        setUpDataFile(data);

        repo.getUser(id, callback);

        assert.calledWith(callback, null, user);
    });

    test('that error bubbles for failure to read the file for user', () => {
        const
            id = any.integer(),
            callback = sinon.spy();
        fs.readFile.yields(error);

        repo.getUser(id, callback);

        assert.calledWith(callback, error);
    });
});
