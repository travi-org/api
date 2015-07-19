'use strict';

var path = require('path'),
    assert = require('chai').assert,
    md5 = require('MD5'),

    mapper = require(path.join(__dirname, '../../lib/mappers/user-mapper')),
    any = require(path.join(__dirname, '../helpers/any'));

suite('user mapper', function () {
    test('that a user is mapped to the view representation', function () {
        var user = {
            id: any.string(),
            'first-name': any.string(),
            'last-name': any.string(),
            email: any.email()
        };

        assert.deepEqual(mapper.mapToView(user), {
            id: user.id,
            'first-name': user['first-name'],
            'last-name': user['last-name'],
            avatar: 'https://www.gravatar.com/avatar/' + md5(user.email)
        });
    });
});