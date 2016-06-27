/*eslint filenames/match-regex: 0 */

const url = require('url');

module.exports = function (grunt) {
    require('dotenv').config({silent: true});
    const
        dbConnectionInfo = url.parse(process.env.DATABASE_URL),
        [user, password] = dbConnectionInfo.auth.split(':');

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
                user,
                password,
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
