import {INTERNAL_SERVER_ERROR, NOT_FOUND, getStatusText} from 'http-status-codes';

export function mapToResponse(err, reply) {
    const profile = 'http://nocarrier.co.uk/profiles/vnd.error/';

    let message = getStatusText(INTERNAL_SERVER_ERROR),
        statusCode = INTERNAL_SERVER_ERROR;

    if (err.notFound) {
        statusCode = NOT_FOUND;
        message = getStatusText(NOT_FOUND);
    }

    reply({
        _links: {profile: {href: profile}},
        message
    }).type(`application/hal+json; profile="${profile}"`).code(statusCode);
}
