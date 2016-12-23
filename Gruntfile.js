/*eslint filenames/match-regex: 0 */

const url = require('url');

module.exports = function (grunt) {
    require('dotenv').config({silent: true});
    const
        dbConnectionInfo = url.parse(process.env.DATABASE_URL),
        [user, password] = dbConnectionInfo.auth.split(':');

    require('time-grunt')(grunt);
    require('load-grunt-config')(grunt, {
        jitGrunt: {},
        config: {
            db: {
                user,
                password,
                url: `postgresql://${dbConnectionInfo.host}${dbConnectionInfo.pathname}`
            }
        }
    });
};
