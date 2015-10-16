var port = process.env.OPENSHIFT_NODEJS_PORT || 3000,
    address = process.env.OPENSHIFT_NODEJS_IP || 'localhost';

module.exports = {
    "connections": [
        {
            port: port,
            address: address,
            labels: ['api']
        }
    ],
    "plugins": {
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
        "hapi-swaggered-ui": [
            {
                select: 'api',
                routes: {
                    prefix: '/documentation'
                }
            }
        ],
        "./router": {}
    }
};