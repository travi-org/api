/*eslint filenames/filenames: 0 */

'use strict';

const url = require('url');

module.exports = function (grunt) {
    const
        dbConnectionInfo = url.parse(process.env.DATABASE_URL),
        auth = dbConnectionInfo.auth.split(':');

    require('time-grunt')(grunt);
    require('load-grunt-config')(grunt, {
        jitGrunt: {
            staticMappings: {
                mochacov: 'grunt-mocha-cov',
                cucumberjs: 'grunt-cucumber'
            }
        },
        config: {
            db: {
                user: auth[0],
                password: auth[1],
                url: `postgresql://${dbConnectionInfo.host}${dbConnectionInfo.pathname}`
            }
        }
    });
};
