import fs from 'fs';
import path from 'path';
import any from '../../../helpers/any-for-api';
import repo from '../../../../lib/api/persons/repository';

require('setup-referee-sinon/globals');

function setUpDataFile(data) {
    fs.readFile.withArgs(
        path.join(__dirname, '../../../../data/persons.json'),
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
            person = { id },
            data = [person];
        setUpDataFile(data);

        repo.getPerson(id, callback);

        assert.calledWith(callback, null, person);
    });

    test('that error bubbles for failure to read the file for user', () => {
        const
            id = any.integer(),
            callback = sinon.spy();
        fs.readFile.yields(error);

        repo.getPerson(id, callback);

        assert.calledWith(callback, error);
    });
});
