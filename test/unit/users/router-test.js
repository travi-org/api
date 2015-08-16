'use strict';

var path = require('path'),
    any = require(path.join(__dirname, '../../helpers/any-for-api')),
    _ = require('lodash'),
    router = require(path.join(__dirname, '../../../lib/router')),
    controller = require(path.join(__dirname, '../../../lib/users/controller'));

suite('user router', function () {
    var handler,
        prepare,
        server = {route: function () {
            return;
        }};

    setup(function () {
        sinon.stub(server, 'route', function (definition) {
            handler = definition.handler;
            prepare = definition.config.plugins.hal.prepare;
        });
        sinon.stub(controller, 'getList');
    });

    teardown(function () {
        server.route.restore();
        controller.getList.restore();
    });

    test('that list route defined correctly', function () {
        router.addRoutesTo(server);

        assert.calledWith(server.route, sinon.match({
            method: 'GET',
            path: '/users',
            config: {
                tags: ['api'],
                plugins: {
                    hal: {
                        api: 'users'
                    }
                }
            }
        }));
    });

    test('that the list route gets gets data from controller', function () {
        var reply = sinon.spy(),
            data = {foo: 'bar'};
        controller.getList.yields(null, data);
        router.addRoutesTo(server);

        handler(null, reply);

        assert.calledWith(reply, data);
    });

    test('that list is formatted to meet hal spec', function () {
        var next = sinon.spy(),
            rep = {
                entity: {
                    users: [
                        {id: any.int()},
                        {id: any.int()},
                        {id: any.int()}
                    ]
                },
                embed: sinon.spy(),
                ignore: sinon.spy()
            };

        prepare(rep, next);

        sinon.assert.callCount(rep.embed, rep.entity.users.length);
        _.each(rep.entity.users, function (user) {
            assert.calledWith(rep.embed, 'users', './' + user.id, user);
        });
        assert.calledWith(rep.ignore, 'users');
        assert.calledOnce(next);
    });
});