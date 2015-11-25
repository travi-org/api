'use strict';

require('newrelic');

var Glue = require('glue'),
    manifest = require('./manifest'),
    Promise = require('promise/lib/es6-extensions');

var composeOptions = {
    relativeTo: __dirname + '/lib'
};

module.exports = new Promise(function (resolve, reject) {
    Glue.compose(manifest, composeOptions, function (err, server) {
        if (err) {
            reject(err);
            throw err;
        }

        server.start(function () {
            console.log('Server started at http://' + server.info.address + ':' + server.info.port);
            resolve(server);
        });
    });
});