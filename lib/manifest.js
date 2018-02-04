const defaultPort = 4444;
const port = process.env.PORT || defaultPort;
const isProduction = 'production' === process.env.NODE_ENV;
const protocol = isProduction ? 'https' : 'http';

export default {
  server: {port},
  register: {
    plugins: [
      {plugin: 'inert'},
      // {
      //   plugin: 'vision',
      //   options: {
      //     engines: {mustache: 'hapi-mustache'},
      //     path: './lib/auth/views',
      //     layoutPath: './lib/auth/views/layout'
      //   }
      // },
      // {
      //   plugin: {
      //     register: 'visionary',
      //     options: {
      //       engines: {mustache: 'hapi-mustache'},
      //       path: './lib/auth/views',
      //       layoutPath: './lib/auth/views/layout'
      //     }
      //   }
      // },
      {
        plugin: 'good',
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
      },
      // {
      //   plugin: 'halacious',
      //   options: {
      //     apiPath: '',
      //     protocol,
      //     absolute: true,
      //     strict: true
      //   }
      // },
      {
        plugin: 'hapi-swaggered',
        options: {
          info: {
            title: 'Travi API',
            version: '1.0'
          }
        }
      },
      // {
      //   plugin: 'hapi-swaggered-ui',
      //   options: {
      //     path: '/documentation'
      //   }
      // },
      {plugin: 'scarecrow'},
      {plugin: './api/auth/strategy'},
      {plugin: './api/routes'},
      // {plugin: 'bell'},
      {plugin: 'hapi-auth-cookie'},
      // {
      //   plugin: './auth/strategy',
      //   options: {
      //     secure: isProduction
      //   }
      // },
      // {plugin: './auth/routes'}
    ]

  }
};
