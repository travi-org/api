const
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash');

function getList(callback) {
    fs.readFile(path.join(__dirname, '../../../data/rides.json'), 'utf8', (err, content) => {
        if (err) {
            callback(err);
        } else {
            callback(null, JSON.parse(content));
        }
    });
}

function getRide(id, callback) {
    getList((err, list) => {
        if (err) {
            callback(err);
        } else {
            callback(null, _.find(list, _.matchesProperty('id', id)));
        }
    });
}

module.exports = {
    getList,
    getRide
};
