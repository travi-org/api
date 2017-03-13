import {OK, NOT_FOUND} from 'http-status-codes';
import {defineSupportCode} from 'cucumber';
import {World} from '../support/world';
import loadApi from '../../../../lib/app';

const statuses = {
  'Not Found': NOT_FOUND,
  Success: OK
};

defineSupportCode(({Before, After, When, Then, setWorldConstructor}) => {
  setWorldConstructor(World);

  Before((scenario, callback) => {
    loadApi.then(() => callback());
  });

  After(function () {
    this.serverResponse = null;
    this.ozUserTicket = null;
  });

  When(/^"([^"]*)" is requested$/, function (endpoint, callback) {
    this.getRequestTo(endpoint, callback);
  });

  Then(/^the response will be "([^"]*)"$/, function (status, callback) {
    assert.equals(this.getResponseStatus(), statuses[status]);

    callback();
  });
});
