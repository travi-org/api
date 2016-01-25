exports.register = function (server, options, next) {
    server.auth.strategy('oz', 'oz', 'optional');

    next();
};

exports.register.attributes = {
    name: 'auth-strategy'
};