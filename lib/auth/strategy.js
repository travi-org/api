export const plugin = {
  async register(server, options) {
    const {secure} = options;

    server.auth.strategy('auth0', 'bell', {
      provider: 'auth0',
      password: process.env.AUTH_COOKIE_ENCRYPTION_PASSWORD,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      config: {
        domain: 'travi.auth0.com'
      },
      forceHttps: secure,
      isSecure: secure
    });

    server.auth.strategy('session', 'cookie', {
      password: process.env.AUTH_COOKIE_ENCRYPTION_PASSWORD,
      redirectTo: '/login',
      appendNext: true,
      isSecure: secure
    });
  },
  name: 'authentication-strategy',
  dependencies: ['bell', 'hapi-auth-cookie']
};
