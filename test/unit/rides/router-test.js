'use strict';

var path = require('path'),
    any = require(path.join(__dirname, '../../helpers/any-for-api')),
    _ = require('lodash'),
    router = require(path.join(__dirname, '../../../lib/router')),
    controller = require(path.join(__dirname, '../../../lib/rides/controller'));

suite('ride router', function () {
    var handler,
        prepare,
        server = {route: function () {
            return;
        }};

    setup(function () {
        sinon.stub(server, 'route', function (definition) {
            if (definition.path === '/rides') {
                handler = definition.handler;
                prepare = definition.config.plugins.hal.prepare;
            }
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
            path: '/rides',
            config: {
                tags: ['api'],
                plugins: {
                    hal: {
                        api: 'rides'
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
                    rides: [
                        {id: any.int()},
                        {id: any.int()},
                        {id: any.int()}
                    ]
                },
                embed: sinon.spy(),
                ignore: sinon.spy()
            };

        prepare(rep, next);

        sinon.assert.callCount(rep.embed, rep.entity.rides.length);
        _.each(rep.entity.rides, function (ride) {
            assert.calledWith(rep.embed, 'rides', './' + ride.id, ride);
        });
        assert.calledWith(rep.ignore, 'rides');
        assert.calledOnce(next);
    });
});