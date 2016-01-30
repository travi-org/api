'use strict';

const apps = require('../../../data/auth/apps');

function getById(id, callback) {
    callback(null, apps[id]);
}

module.exports = {
    getById
};
