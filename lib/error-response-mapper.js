'use strict';

function mapToResponse(err, reply) {
    var profile = 'http://nocarrier.co.uk/profiles/vnd.error/',

        message = 'Server Error',
        statusCode = 500;

    if (err.notFound) {
        statusCode = 404;
        message = 'Not Found';
    }

    reply({
        _links: { profile: {href: profile } },
        message: message
    }).type('application/hal+json; profile="' + profile + '"').code(statusCode);
}

module.exports = {
    mapToResponse: mapToResponse
};