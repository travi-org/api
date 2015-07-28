'use strict';

var path = require('path'),
    assert = require('chai').assert,
    md5 = require('MD5'),
    _ = require('lodash'),

    mapper = require(path.join(__dirname, '../../lib/mappers/user-mapper')),
    any = require(path.join(__dirname, '../helpers/any-for-api'));

function assertUserMappedToViewProperly(userView, user) {
    assert.deepEqual(userView, {
        id: user.id,
        'first-name': user['first-name'],
        'last-name': user['last-name'],
        avatar: 'https://www.gravatar.com/avatar/' + md5(user.email) + '?size=32'
    });
}
suite('user mapper', function () {
    test('that a user is mapped to the view representation', function () {
        var user = any.resources.user();

        assertUserMappedToViewProperly(mapper.mapToView(user), user);
    });

    test('that a list of users is mapped to a list of user view objects', function () {
        var users = any.listOf(any.resources.user),
            userViews = mapper.mapListToView(users);

        _.forEach(users, function (user, index) {
            assertUserMappedToViewProperly(userViews[index], user);
        });
    });
});