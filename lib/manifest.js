var port = process.env.PORT || 3000;

module.exports = {
    connections: [{
        port: port,
        labels: ['api']
    }],
    registrations: [
        {plugin: 'inert'},
        {plugin: 'vision'},
        {
            plugin: {
                register: 'good',
                options: {
                    'reporters': [
                        {
                            'reporter': require('good-console'),
                            'events': {
                                log: '*',
                                response: '*',
                                error: '*'
                            }
                        }
                    ]
                }
            }
        },
        {
            plugin: {
                register: 'halacious',
                options: {
                    apiPath: '',
                    protocol: 'https',
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
        {plugin: './api/router'}
    ]
};