import apps from '../../../data/auth/apps.json';

function getById(id, callback) {
  callback(null, apps[id]);
}

export default {
  getById
};
