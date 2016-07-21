import md5 from 'md5';
import _ from 'lodash';

function mapToView(person, size, scopes) {
    person.avatar = {
        src: `https://www.gravatar.com/avatar/${md5(person.email)}?size=${size}`,
        size
    };

    if (scopes) {
        return person;
    }

    return _.omit(person, 'email');
}

function mapListToView(persons, size, scopes) {
    return persons.map((person) => mapToView(person, size, scopes));
}

export default {
    mapToView,
    mapListToView
};
