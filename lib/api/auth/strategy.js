import apps from './apps';
import grants from './grants';

exports.register = function (server, options, next) {
    server.auth.strategy('oz', 'oz', 'optional', {
        oz: {
            encryptionPassword: 'reallylongpasswordthatisntverysecureyet',
            loadAppFunc: apps.getById,
            loadGrantFunc: grants.getById
        }
    });

    next();
};

exports.register.attributes = {
    name: 'auth-strategy',
    dependencies: 'scarecrow'
};
