const
    defaultPort = 3000,
    port = process.env.PORT || defaultPort,
    isProduction = 'production' === process.env.NODE_ENV,
    protocol = isProduction ? 'https' : 'http';

export default {
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
                    ops: {
                        interval: 1000
                    },
                    'reporters': {
                        console: [
                            {
                                module: 'good-squeeze',
                                name: 'Squeeze',
                                args: [{ log: '*', response: '*', error: '*' }]
                            },
                            {
                                module: 'good-console'
                            },
                            'stdout'
                        ]
                    }
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
