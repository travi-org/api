/*eslint filenames/filenames: 0 */

'use strict';

const url = require('url');

module.exports = function (grunt) {
    require('dotenv').config({silent: true});
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

    grunt.event.on('coverage', (lcov, done) => {
        require('coveralls').handleInput(lcov, (err) => {
            if (err) {
                return done(err);
            }
            return done();
        });
    });
};
