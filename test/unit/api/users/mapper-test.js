'use strict';

var path = require('path'),
    assert = require('chai').assert,
    md5 = require('md5'),
    _ = require('lodash'),

    mapper = require(path.join(__dirname, '../../../../lib/api/users/mapper')),
    any = require(path.join(__dirname, '../../../helpers/any-for-api'));

function assertUserMappedToViewProperly(userView, user, size) {
    assert.deepEqual(userView, {
        id: user.id,
        'first-name': user['first-name'],
        'last-name': user['last-name'],
        avatar: {
            src: 'https://www.gravatar.com/avatar/' + md5(user.email) + '?size=' + size,
            size: size
        }
    });
}

suite('user mapper', function () {
    test('that a user is mapped to the view representation', function () {
        var user = any.resources.user(),
            size = any.int();

        assertUserMappedToViewProperly(mapper.mapToView(user, size), user, size);
    });

    test('that a list of users is mapped to a list of user view objects', function () {
        var users = any.listOf(any.resources.user),
            size = any.int(),
            userViews = mapper.mapListToView(users, size);

        _.forEach(users, function (user, index) {
            assertUserMappedToViewProperly(userViews[index], user, size);
        });
    });
});