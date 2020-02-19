export const defaultPort = 4444;
const port = process.env.PORT || defaultPort;
const isProduction = 'production' === process.env.NODE_ENV;

export default {
  connections: [{
    port,
    labels: ['api']
  }],
  registrations: [
    {
      plugin: {
        register: 'hapi-graceful-shutdown-plugin',
        options: {
          sigtermTimeout: 10,
          sigintTimeout: 1
        }
      }
    },
    {plugin: 'inert'},
    {plugin: 'vision'},
    {
      plugin: {
        register: 'visionary',
        options: {
          engines: {mustache: 'hapi-mustache'},
          path: './lib/auth/views',
          layoutPath: './lib/auth/views/layout'
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
          reporters: {
            console: [
              {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{log: '*', request: '*', response: '*', error: '*'}]
              },
              {module: 'good-console'},
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
    {plugin: './api/routes'},
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
