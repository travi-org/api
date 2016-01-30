'use strict';

const grants = require('../../../data/auth/grants');

function getById(id, callback) {
    callback(null, grants[id]);
}

module.exports = {
    getById
};
