import md5 from 'md5';
import clone from 'clone';

function mapToView(personSource, size, scopes) {
  const person = clone(personSource);
  person.avatar = {
    src: `https://www.gravatar.com/avatar/${md5(person.email)}?size=${size}`,
    size
  };

  if (scopes) {
    return person;
  }

  const {email, ...trimmed} = person;

  return trimmed;
}

function mapListToView(persons, size, scopes) {
  return persons.map(person => mapToView(person, size, scopes));
}

export default {
  mapToView,
  mapListToView
};
