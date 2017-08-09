import any from '@travi/any';
import configurator from '../../../lib/api/halacious-configurator';

suite('halacious configurator', () => {
  const resourceType = any.string();

  test('that halacious config is returned for the provided resource-type', () => {
    const halaciousConfig = configurator(resourceType);

    assert.equals(halaciousConfig.api, resourceType);
  });

  test('that list is formatted to meet hal spec', () => {
    const next = sinon.spy();
    const rep = {
      entity: {
        [resourceType]: [
          {id: any.integer()},
          {id: any.integer()},
          {id: any.integer()}
        ]
      },
      embed: sinon.spy(),
      ignore: sinon.spy()
    };

    const halaciousConfig = configurator(resourceType);
    halaciousConfig.prepare(rep, next);

    sinon.assert.callCount(rep.embed, rep.entity[resourceType].length);
    rep.entity[resourceType].forEach(resource => {
      assert.calledWith(rep.embed, resourceType, `./${resource.id}`, resource);
    });
    assert.calledWith(rep.ignore, resourceType);
    assert.calledOnce(next);
  });
});
