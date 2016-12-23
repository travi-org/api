import grants from '../../../data/auth/grants.json';

function getById(id, callback) {
  callback(null, grants[id]);
}

export default {
  getById
};
