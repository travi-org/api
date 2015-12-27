'use strict';

var path = require('path'),
    fs = require('fs'),
    any = require(path.join(__dirname, '../../../helpers/any-for-api')),
    repo = require(path.join(__dirname, '../../../../lib/api/rides/repository'));

require('setup-referee-sinon/globals');

function setUpDataFile(data) {
    fs.readFile.withArgs(
        path.join(__dirname, '../../../../data/rides.json'),
        'utf8'
    ).yields(null, JSON.stringify(data));
}

suite('user repository', function () {
    var error = any.string();

    setup(function () {
        sinon.stub(fs, 'readFile');
    });

    teardown(function () {
        fs.readFile.restore();
    });

    test('that list is loaded from a file', function () {
        var callback = sinon.spy(),
            data = {};
        setUpDataFile(data);

        repo.getList(callback);

        assert.calledWith(callback, null, data);
    });

    test('that error bubbles for failure to read the file for list', function () {
        var callback = sinon.spy();
        fs.readFile.yields(error);

        repo.getList(callback);

        assert.calledWith(callback, error);
    });

    test('that ride is loaded from file', function () {
        var id = any.int(),
            callback = sinon.spy(),
            ride = { id: id },
            data = [ride];
        setUpDataFile(data);

        repo.getRide(id, callback);

        assert.calledWith(callback, null, ride);
    });

    test('that error bubbles for failure to read the file for ride', function () {
        var id = any.int(),
            callback = sinon.spy();
        fs.readFile.yields(error);

        repo.getRide(id, callback);

        assert.calledWith(callback, error);
    });
});