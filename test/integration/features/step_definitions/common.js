import loadApi from '../../../../lib/app';

const SUCCESS = 200;
const NOT_FOUND = 404;
const statuses = {
  'Not Found': NOT_FOUND,
  Success: SUCCESS
};

module.exports = function () {
  this.World = require('../support/world.js').World;

  this.Before((scenario, callback) => {
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
