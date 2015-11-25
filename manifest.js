var port = process.env.PORT || 3000;

module.exports = {
    "connections": [{
        port: port,
        labels: ['api']
    }],
    "plugins": {
        'inert': {},
        'vision': {},
        'good': {
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
        },
        "halacious": {
            apiPath: '',
            protocol: 'https',
            absolute: true,
            strict: true
        },
        "hapi-swaggered": {
            info: {
                title: 'Travi API',
                version: '1.0'
            }
        },
        "hapi-swaggered-ui": {
            path: '/documentation'
        },
        "./router": {}
    }
};