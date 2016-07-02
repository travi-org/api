import apps from '../../../data/auth/apps';

function getById(id, callback) {
    callback(null, apps[id]);
}

export default {
    getById
};
