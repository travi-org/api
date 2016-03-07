'use strict';


const
    defaultPort = 3000,
    port = process.env.PORT || defaultPort,
    isProduction = 'production' === process.env.NODE_ENV,
    protocol = isProduction ? 'https' : 'http';

module.exports = {
    connections: [{
        port,
        labels: ['api']
    }],
    registrations: [
        {plugin: 'inert'},
        {plugin: 'vision'},
        {
            plugin: {
                register: 'visionary',
                options: {
                    'engines': {'mustache': 'hapi-mustache'},
                    'path': './lib/auth/views',
                    'layoutPath': './lib/auth/views/layout'
                }
            }
        },
        {
            plugin: {
                register: 'good',
                options: {
                    'reporters': [{
                        'reporter': require('good-console'),
                        'events': {
                            log: '*',
                            response: '*',
                            error: '*'
                        }
                    }]
                }
            }
        },
        {
            plugin: {
                register: 'halacious',
                options: {
                    apiPath: '',
                    protocol,
                    absolute: true,
                    strict: true
                }
            }
        },
        {
            plugin: {
                register: 'hapi-swaggered',
                options: {
                    info: {
                        title: 'Travi API',
                        version: '1.0'
                    }
                }
            }
        },
        {
            plugin: {
                register: 'hapi-swaggered-ui',
                options: {
                    path: '/documentation'
                }
            }
        },
        {plugin: 'scarecrow'},
        {plugin: './api/auth/strategy'},
        {plugin: './api/router'},
        {plugin: 'bell'},
        {plugin: 'hapi-auth-cookie'},
        {
            plugin: {
                register: './auth/strategy',
                options: {
                    secure: isProduction
                }
            }
        },
        {plugin: './auth/routes'}
    ]
};
