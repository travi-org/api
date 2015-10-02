'use strict';

var hapi = require('hapi'),
    halacious = require('halacious'),
    path = require('path'),

    router = require('./lib/router'),

    api = new hapi.Server(),
    port = process.env.OPENSHIFT_NODEJS_PORT || 3000,
    address = process.env.OPENSHIFT_NODEJS_IP || 'localhost';

api.connection({
    port: port,
    address: address,
    labels: ['api']
});

api.register({
    register: halacious,
    options: {
        apiPath: '',
        protocol: 'https',
        absolute: true,
        strict: true
    }
}, function (err) {
    if (err) {
        console.log(err);
    }
});

api.register({
    register: require('hapi-swaggered'),
    options: {
        info: {
            title: 'Travi API',
            version: '1.0'
        }
    }
}, function (err) {
    if (err) {
        api.log(['error'], 'hapi-swagger load error: ' + err);
    } else {
        api.log(['start'], 'hapi-swagger interface loaded');
    }
});

api.register(
    { register: require('hapi-swaggered-ui') },
    {
        select: 'api',
        routes: {
            prefix: '/documentation'
        }
    },
    function (err) {
        if (err) {
            throw err;
        }
    }
);

router.addRoutesTo(api);

if (!module.parent) {
    api.start(function (err) {
        if (err) {
            return console.error(err);
        }

        api.log('Server started', api.info.uri);
    });
}

module.exports = api;
