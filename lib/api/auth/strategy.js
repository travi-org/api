import apps from './apps';
import grants from './grants';

export function register(server, options, next) {
  server.auth.strategy('oz', 'oz', 'optional', {
    oz: {
      encryptionPassword: 'reallylongpasswordthatisntverysecureyet',
      loadAppFunc: apps.getById,
      loadGrantFunc: grants.getById
    }
  });

  next();
}

register.attributes = {
  name: 'auth-strategy',
  dependencies: 'scarecrow'
};
