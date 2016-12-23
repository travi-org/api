import {assert} from 'chai';
import md5 from 'md5';
import mapper from '../../../../lib/api/persons/mapper';
import any from '../../../helpers/any-for-api';

function assertPersonMappedToViewProperly(personView, person, size) {
  assert.deepEqual(personView, {
    id: person.id,
    'first-name': person['first-name'],
    'last-name': person['last-name'],
    avatar: {
      src: `https://www.gravatar.com/avatar/${md5(person.email)}?size=${size}`,
      size
    }
  });
}

suite('person mapper', () => {
  test('that a person is mapped to the view representation', () => {
    const person = any.resources.person();
    const size = any.integer();

    assertPersonMappedToViewProperly(mapper.mapToView(person, size), person, size);
  });

  test('that a list of persons is mapped to a list of person view objects', () => {
    const persons = any.listOf(any.resources.person);
    const size = any.integer();
    const personViews = mapper.mapListToView(persons, size);

    persons.forEach((person, index) => {
      assertPersonMappedToViewProperly(personViews[index], person, size);
    });
  });

  test('that email is populated when authorized', () => {
    const person = any.resources.person();
    const size = any.integer();

    assert.equal(mapper.mapToView(person, size, any.listOf(any.string)).email, person.email);
  });

  test('that email is populated in each item in list when authorized', () => {
    const persons = any.listOf(any.resources.person);
    const size = any.integer();
    const personViews = mapper.mapListToView(persons, size, any.listOf(any.string));

    persons.forEach((person, index) => {
      assert.equal(personViews[index].email, person.email);
    });
  });
});
