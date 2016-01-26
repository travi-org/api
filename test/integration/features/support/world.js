'use strict';

const
    path = require('path'),
    loadApi = require(path.join(__dirname, '../../../../lib/app.js'));

module.exports.World = function World() {
    const requestTo = (options, callback) => {
        loadApi.then((server) => {
            this.server = server;

            server.inject({
                method: options.method,
                url: options.url,
                headers: {
                    'Accept': this.mime
                }
            }, (response) => {
                this.serverResponse = response;

                callback();
            });
        });
    };

    this.makeRequestTo = (url, callback) => {
        requestTo({
            url,
            method: 'GET'
        }, callback);
    };

    this.postRequestTo = (url, callback) => {
        requestTo({
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
