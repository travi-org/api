import {NOT_FOUND, OK} from 'http-status-codes';
import {defineSupportCode} from '@cucumber/cucumber';
import {assert} from 'chai';
import {World} from '../support/world';

const statuses = {
  'Not Found': NOT_FOUND,
  Success: OK
};

defineSupportCode(({Before, After, When, Then, setWorldConstructor}) => {
  setWorldConstructor(World);

  Before(async function () {
    this.server = await require('../../../../lib/app.js').default;
  });

  After(function () {
    this.serverResponse = null;
    this.ozUserTicket = null;
  });

  When(/^"([^"]*)" is requested$/, function (endpoint, callback) {
    this.getRequestTo(endpoint, callback);
  });

  Then(/^the response will be "([^"]*)"$/, function (status, callback) {
    assert.deepEqual(this.getResponseStatus(), statuses[status]);

    callback();
  });
});
