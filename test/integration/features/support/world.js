'use strict';

const
    oz = require('oz'),
    path = require('path'),
    loadApi = require(path.join(__dirname, '../../../../lib/app.js'));

module.exports.World = function World() {
    this.makeOzRequest = (requestDetails, appDetails, callback) => {
        const
            method = 'POST',
            url = `http://example.com${requestDetails.endpoint}`;

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
                //console.log(this.getResponseBody());
                assert.equals(this.getResponseStatus(), 200);

                callback(null, this.serverResponse.result.entity);
            }
        );
    };

    this.requestTo = (options, callback) => {
        loadApi.then((server) => {
            this.server = server;

            var headers = Object.assign({
                'Accept': this.mime
            }, options.headers);

            server.inject({
                method: options.method,
                url: options.url,
                payload: options.payload,
                headers
            }, (response) => {
                this.serverResponse = response;

                callback();
            });
        });
    };

    this.getRequestTo = (url, callback) => {
        this.requestTo({
            url,
            method: 'GET'
        }, callback);
    };

    this.postRequestTo = (url, callback) => {
        this.requestTo({
            url,
            method: 'POST'
        }, callback);
    };

    this.getBaseUrl = () => {
        return 'https://' + this.server.info.host + ':' + this.server.info.port;
    };

    this.getResponseBody = () => this.serverResponse.payload;
    this.getResponseStatus = () => this.serverResponse.statusCode;
    this.getResponseHeaders = () => this.serverResponse.headers;
};
