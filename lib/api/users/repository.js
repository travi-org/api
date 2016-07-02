import fs from 'fs';
import _ from 'lodash';
import path from 'path';

function getList(callback) {
    fs.readFile(path.join(__dirname, '../../../data/users.json'), 'utf8', (err, content) => {
        if (err) {
            callback(err);
        } else {
            callback(null, JSON.parse(content));
        }
    });
}

function getUser(id, callback) {
    getList((err, list) => {
        if (err) {
            callback(err);
        } else {
            callback(null, _.find(list, _.matchesProperty('id', id)));
        }
    });
}

export default {
    getList,
    getUser
};
