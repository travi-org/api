import oz from 'oz';
import {assert} from 'referee';
import any from '@travi/any';
import {OK} from 'http-status-codes';

process.env.AUTH0_CLIENT_ID = any.string();
process.env.AUTH0_CLIENT_SECRET = any.string();
process.env.AUTH_COOKIE_ENCRYPTION_PASSWORD = any.string();

export function World() {
  const loadApi = require('../../../../lib/app.js');

  this.makeOzRequest = (requestDetails, appDetails, callback) => {
    const method = 'POST';
    const url = `http://example.com${requestDetails.endpoint}`;

    this.requestTo(
      {
        url,
        method,
        headers: {
          authorization: oz.client.header(url, method, appDetails).field
        },
        payload: requestDetails.payload
      },
      () => {
        assert.equals(this.getResponseStatus(), OK, this.serverResponse.payload);

        callback(null, this.serverResponse.result);
      }
    );
  };

  this.requestTo = (options, callback) => {
    loadApi.then(server => {
      this.serverResponse = null;
      this.server = server;

      const headers = Object.assign({
        Accept: this.mime
      }, options.headers);

      server.inject({
        method: options.method,
        url: options.url,
        payload: options.payload,
        headers
      }, response => {
        this.serverResponse = response;

        callback();
      });
    }).catch(callback);
  };

  this.getRequestTo = (uri, callback) => {
    const headers = {};
    const method = 'GET';
    let url = uri;

    if (this.ozUserTicket) {
      url = `http://example.com${url}`;
      headers.authorization = oz.client.header(url, method, this.ozUserTicket).field;
    }

    this.requestTo(
      {url, method, headers},
      callback
    );
  };

  this.postRequestTo = (url, callback) => {
    this.requestTo({
      url,
      method: 'POST'
    }, callback);
  };

  this.getBaseUrl = () => `http://${this.server.info.host}:${this.server.info.port}`;

  this.getResponseBody = () => this.serverResponse.payload;
  this.getResponseStatus = () => this.serverResponse.statusCode;
  this.getResponseHeaders = () => this.serverResponse.headers;

  this.getResourceListFromResponse = (resourceType, response) => {
    const resources = response._embedded[resourceType];
    let list;

    if (resources.length) {
      list = resources;
    } else {
      list = [resources];
    }

    return list;
  };
}
