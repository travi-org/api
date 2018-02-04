import apps from './apps';
import grants from './grants';

export const plugin = {
  async register(server) {
    server.auth.strategy('oz', 'oz', {
      oz: {
        encryptionPassword: 'reallylongpasswordthatisntverysecureyet',
        loadAppFunc: apps.getById,
        loadGrantFunc: grants.getById
      }
    });
  },
  name: 'auth-strategy',
  dependencies: 'scarecrow'
};
