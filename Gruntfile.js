/*eslint filenames/filenames: 0 */

'use strict';

module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-config')(grunt, {
        jitGrunt: {
            staticMappings: {
                mochacov: 'grunt-mocha-cov',
                cucumberjs: 'grunt-cucumber'
            }
        },
        db: {
            url: process.env.API_DB_URL,
            password: process.env.API_DB_PASSWORD
        }
    });
};
