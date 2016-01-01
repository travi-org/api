'use strict';

const
    path = require('path'),
    loadApi = require(path.join(__dirname, '../../../../lib/app.js'));

module.exports.World = function World() {
    this.makeRequestTo = (url, callback) => {
        loadApi.then((server) => {
            this.server = server;

            server.inject({
                method: 'GET',
                url,
                headers: {
                    'Accept': this.mime
                }
            }, (response) => {
                this.serverResponse = response;

                callback();
            });
        });
    };

    this.getBaseUrl = () => {
        return 'https://' + this.server.info.host + ':' + this.server.info.port;
    };

    this.getResponseBody = () => this.serverResponse.payload;
    this.getResponseStatus = () => this.serverResponse.statusCode;
    this.getResponseHeaders = () => this.serverResponse.headers;
};
