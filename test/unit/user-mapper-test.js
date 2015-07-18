'use strict';

var path = require('path'),
    assert = require('chai').assert,
    md5 = require('MD5'),

    mapper = require(path.join(__dirname, '../../lib/mappers/user-mapper'));

suite('user mapper', function () {
    test('that a user is mapped to the view representation', function () {
        var id = 'something',
            first = 'foo',
            last = 'bar',
            email = 'some@email.com';

        assert.deepEqual(
            mapper.mapToView({
                id: id,
                'first-name': first,
                'last-name': last,
                email: email
            }),
            {
                id: id,
                'first-name': first,
                'last-name': last,
                avatar: 'https://www.gravatar.com/avatar/' + md5(email)
            }
        );
    });
});