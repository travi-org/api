'use strict';

var path= require('path'),
    fs = require('fs');

function getList(callback) {
    fs.readFile(path.join(__dirname, '../../data/users.json'), 'utf8', callback);
}

module.exports = {
    getList: getList
};