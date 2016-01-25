exports.register = function (server, options, next) {
    server.auth.strategy('oz', 'oz', 'optional', {
        oz: {
            encryptionPassword: 'password'
        }
    });

    next();
};

exports.register.attributes = {
    name: 'auth-strategy'
};