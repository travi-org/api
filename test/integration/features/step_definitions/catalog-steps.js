import referee, {assert} from 'referee';
import {OK} from 'http-status-codes';
import {defineSupportCode} from 'cucumber';
import {World} from '../support/world';

referee.format = require('formatio').configure({quoteStrings: false}).ascii;

defineSupportCode(({Given, When, Then, setWorldConstructor}) => {
  setWorldConstructor(World);

  Given(/^the api contains no resources$/, callback => {
    callback();
  });

  When(/^the catalog is requested$/, function (callback) {
    this.getRequestTo('/', callback);
  });

  Then(/^the catalog should include top level links$/, function (callback) {
    const baseUrl = this.getBaseUrl();

    assert.equals(this.getResponseStatus(), OK);
    assert.equals(
      JSON.parse(this.getResponseBody())._links,
      {
        self: {href: `${baseUrl}/`},
        rides: {href: `${baseUrl}/rides`},
        persons: {href: `${baseUrl}/persons`}
      }
    );

    callback();
  });
});
