import repo from './repository';
import mapper from './mapper';

const THUMBNAIL_SIZE = 32;
const AVATAR_SIZE = 320;

function getList(scopes, callback) {
  repo.getList((err, list) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {persons: mapper.mapListToView(list, THUMBNAIL_SIZE, scopes)});
    }
  });
}

function getPerson(id, scopes, callback) {
  repo.getPerson(id, (err, person) => {
    if (err) {
      callback(err);
    } else if (person) {
      callback(null, mapper.mapToView(person, AVATAR_SIZE, scopes));
    } else {
      callback({notFound: true});
    }
  });
}

export default {
  getList,
  getPerson
};
