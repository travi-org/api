import referee, {assert} from 'referee';
import {OK} from 'http-status-codes';
import {defineSupportCode} from 'cucumber';
import {World} from '../support/world';

require('referee-more-assertions')(referee);

defineSupportCode(({When, Then, setWorldConstructor}) => {
  setWorldConstructor(World);

  When(/^the documentation is requested in the browser$/, function (callback) {
    this.getRequestTo('/documentation', callback);
  });

  Then(/^the documentation should be viewable in the browser$/, function (callback) {
    assert.equals(this.getResponseStatus(), OK);
    assert.equals(this.getResponseHeaders()['content-type'], 'text/html; charset=utf-8');

    callback();
  });

  When(/^the docs are requested$/, function (callback) {
    this.getRequestTo('/swagger', callback);
  });

  Then(/^the top-level endpoints should be included$/, function (callback) {
    const {paths} = JSON.parse(this.getResponseBody());
    assert.defined(paths['/rides']);
    assert.defined(paths['/persons']);

    callback();
  });

  Then(/^the GET by id endpoints should be included$/, function (callback) {
    const {paths} = JSON.parse(this.getResponseBody());

    assert.defined(paths['/rides/{id}']);
    assert.defined(paths['/persons/{id}']);

    callback();
  });
});
