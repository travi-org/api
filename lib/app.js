'use strict';

require('newrelic');

var Glue = require('glue'),
    manifest = require('./manifest');

var composeOptions = {
    relativeTo: __dirname
};

module.exports = new Promise(function (resolve, reject) {
    Glue.compose(manifest, composeOptions, function (err, server) {
        if (err) {
            reject(err);
            throw err;
        }

        server.start(function (err) {
            if (err) {
                reject(err);
                throw err;
            }

            console.log(`Server started at http://${server.info.address}:${server.info.port}`);     //eslint-disable-line no-console

            resolve(server);
        });
    });
}).catch((err) => {
    console.error(err);         //eslint-disable-line no-console
    console.trace();            //eslint-disable-line no-console
});