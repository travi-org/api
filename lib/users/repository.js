'use strict';

var path= require('path'),
    fs = require('fs'),
    _ = require('lodash');

function getList(callback) {
    fs.readFile(path.join(__dirname, '../../data/users.json'), 'utf8', function (err, content) {
        callback(null, JSON.parse(content));
    });
}

function getUser(id, callback) {
    getList(function (err, list) {
        callback(null, _.find(list, _.matchesProperty('id', id)));
    });
}

module.exports = {
    getList: getList,
    getUser: getUser
};