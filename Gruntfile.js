/*global module*/
module.exports = function (grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-config')(grunt, {
        jitGrunt: {
            staticMappings: {
                mochacov: 'grunt-mocha-cov',
                cucumberjs: 'grunt-cucumber'
            }
        }
    });
};
