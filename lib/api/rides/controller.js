const
    path = require('path'),
    repo = require(path.join(__dirname, './repository'));

function getList(scopes, callback) {
    repo.getList((err, list) => {
        if (err) {
            callback(err);
        } else {
            callback(null, { rides: list });
        }
    });
}

function getRide(id, callback) {
    repo.getRide(id, (err, ride) => {
        if (err) {
            callback(err);
        } else if (ride) {
            callback(null, ride);
        } else {
            callback({notFound: true});
        }
    });
}

module.exports = {
    getRide,
    getList
};
