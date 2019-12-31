import {assert} from 'chai';
import {OK} from 'http-status-codes';
import {defineSupportCode} from 'cucumber';
import {World} from '../support/world';

defineSupportCode(({When, Then, setWorldConstructor}) => {
  setWorldConstructor(World);

  When(/^the documentation is requested in the browser$/, function (callback) {
    this.getRequestTo('/documentation', callback);
  });

  Then(/^the documentation should be viewable in the browser$/, function (callback) {
    assert.equal(this.getResponseStatus(), OK);
    assert.equal(this.getResponseHeaders()['content-type'], 'text/html; charset=utf-8');

    callback();
  });

  When(/^the docs are requested$/, function (callback) {
    this.getRequestTo('/swagger', callback);
  });

  Then(/^the top-level endpoints should be included$/, function (callback) {
    const {paths} = JSON.parse(this.getResponseBody());
    assert.isDefined(paths['/rides']);
    assert.isDefined(paths['/persons']);

    callback();
  });

  Then(/^the GET by id endpoints should be included$/, function (callback) {
    const {paths} = JSON.parse(this.getResponseBody());

    assert.isDefined(paths['/rides/{id}']);
    assert.isDefined(paths['/persons/{id}']);

    callback();
  });
});
