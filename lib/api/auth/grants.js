import grants from '../../../data/auth/grants';

function getById(id, callback) {
    callback(null, grants[id]);
}

export default {
    getById
};
