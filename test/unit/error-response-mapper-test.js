'use strict';

var path = require('path'),
    errorMapper = require(path.join(__dirname, '../../lib/error-response-mapper'));

require('setup-referee-sinon/globals');

suite('error response mapper', function () {
    var type = sinon.stub(),
        code = sinon.stub(),
        responseApi = {
            code: code,
            type: type
        },
        reply = sinon.stub().returns(responseApi);
    code.returns(responseApi);
    type.returns(responseApi);

    teardown(function () {
        code.reset();
        type.reset();
    });

    test('that vnd.error spec met', function () {
        errorMapper.mapToResponse({}, reply);

        assert.calledWith(reply, sinon.match({
            _links: {
                profile: {
                    href: 'http://nocarrier.co.uk/profiles/vnd.error/'
                }
            }
        }));
        assert.calledWith(type, 'application/hal+json; profile="http://nocarrier.co.uk/profiles/vnd.error/"');
    });

    suite('unknown error', function () {
        test('that status is set to 500', function () {
            errorMapper.mapToResponse({}, reply);

            assert.calledWith(code, 500);
            assert.calledWith(reply, sinon.match({message: 'Server Error'}));
        });
    });

    suite('not found error', function () {
        test('that status is set to 404', function () {
            errorMapper.mapToResponse({
                notFound: true
            }, reply);

            assert.calledWith(code, 404);
            assert.calledWith(reply, sinon.match({message: 'Not Found'}));
        });
    });
});