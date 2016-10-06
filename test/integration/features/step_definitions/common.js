import loadApi from '../../../../lib/app.js';

const
    SUCCESS = 200,
    NOT_FOUND = 404,
    statuses = {
        'Not Found': NOT_FOUND,
        'Success': SUCCESS
    };

module.exports = function () {
    this.World = require('../support/world.js').World;
    
    this.Before(function (scenario, callback) {
        loadApi.then(() => callback());
    });

    this.After(function () {
        this.serverResponse = null;
        this.ozUserTicket = null;
    });

    this.When(/^"([^"]*)" is requested$/, function (endpoint, callback) {
        this.getRequestTo(endpoint, callback);
    });

    this.Then(/^the response will be "([^"]*)"$/, function (status, callback) {
        assert.equals(this.getResponseStatus(), statuses[status]);

        callback();
    });
};
