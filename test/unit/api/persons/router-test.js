import Joi from 'joi';
import deepFreeze from 'deep-freeze';
import any from '../../../helpers/any-for-api';
import router from '../../../../lib/api/router';
import controller from '../../../../lib/api/persons/controller';
import * as errorMapper from '../../../../lib/api/error-response-mapper';

suite('person router', () => {
  const requestNoAuth = deepFreeze({auth: {}});
  const server = {
    route() {
      return undefined;
    }
  };
  let prepare;
  let handlers = {};

  setup(() => {
    sinon.stub(server, 'route', definition => {
      if ('/persons' === definition.path) {
        handlers.list = definition.handler;
        prepare = definition.config.plugins.hal.prepare;
      } else if ('/persons/{id}' === definition.path) {
        handlers.person = definition.handler;
      }
    });
    sinon.stub(errorMapper, 'mapToResponse');
  });

  teardown(() => {
    errorMapper.mapToResponse.restore();
    server.route.restore();
    prepare = null;
    handlers = {};
  });

  suite('list route', () => {
    setup(() => {
      sinon.stub(controller, 'getList');
    });

    teardown(() => {
      controller.getList.restore();
    });

    test('that list route defined correctly', () => {
      router.register(server, null, sinon.spy());

      assert.calledWith(server.route, sinon.match({
        method: 'GET',
        path: '/persons',
        config: {
          tags: ['api'],
          plugins: {
            hal: {
              api: 'persons'
            }
          }
        }
      }));
    });

    test('that the list route gets gets data from controller', () => {
      const reply = sinon.spy();
      const data = {foo: 'bar'};
      controller.getList.yields(null, data);
      router.register(server, null, sinon.spy());

      handlers.list(requestNoAuth, reply);

      assert.calledWith(reply, data);
    });

    test('that scopes are passed to controller for list request with authorization', () => {
      const reply = sinon.spy();
      const scopes = any.listOf(any.string);
      router.register(server, null, sinon.spy());

      handlers.list({
        auth: {
          credentials: {scope: scopes}
        }
      }, reply);

      assert.calledWith(controller.getList, scopes);
    });

    test('that list is formatted to meet hal spec', () => {
      const next = sinon.spy();
      const rep = {
        entity: {
          persons: [
            {id: any.integer()},
            {id: any.integer()},
            {id: any.integer()}
          ]
        },
        embed: sinon.spy(),
        ignore: sinon.spy()
      };
      router.register(server, null, sinon.spy());

      prepare(rep, next);

      sinon.assert.callCount(rep.embed, rep.entity.persons.length);
      rep.entity.persons.forEach(person => {
        assert.calledWith(rep.embed, 'persons', `./${person.id}`, person);
      });
      assert.calledWith(rep.ignore, 'persons');
      assert.calledOnce(next);
    });

    test('that error mapped when list request results in error', () => {
      const reply = sinon.spy();
      const err = {};
      router.register(server, null, sinon.spy());
      controller.getList.yields(err);

      handlers.list(requestNoAuth, reply);

      assert.calledWith(errorMapper.mapToResponse, err, reply);
      refute.called(reply);
    });
  });

  suite('person route', () => {
    setup(() => {
      sinon.stub(controller, 'getPerson');
    });

    teardown(() => {
      controller.getPerson.restore();
    });

    test('that individual route defined correctly', () => {
      router.register(server, null, sinon.spy());

      assert.calledWith(server.route, sinon.match({
        method: 'GET',
        path: '/persons/{id}',
        config: {
          tags: ['api'],
          validate: {
            params: {
              id: Joi.string().required()
            }
          }
        }
      }));
    });

    test('that person returned from controller', () => {
      const id = any.integer();
      const reply = sinon.spy();
      const user = {id};
      controller.getPerson.withArgs(id).yields(null, user);
      router.register(server, null, sinon.spy());

      handlers.person({
        params: {id},
        auth: requestNoAuth.auth
      }, reply);

      assert.calledWith(reply, user);
    });

    test('that scopes are passed to controller for request with authorization', () => {
      const id = any.integer();
      const reply = sinon.spy();
      const scopes = any.listOf(any.string);
      router.register(server, null, sinon.spy());

      handlers.person({
        params: {id},
        auth: {credentials: {scope: scopes}}
      }, reply);

      assert.calledWith(controller.getPerson, id, scopes);
    });

    test('that 404 returned when person does not exist', () => {
      const id = any.integer();
      const setContentType = sinon.spy();
      const setResponseCode = sinon.stub().returns({type: setContentType});
      const reply = sinon.stub().withArgs().returns({code: setResponseCode});
      const err = {notFound: true};
      controller.getPerson.withArgs(id).yields(err, null);
      router.register(server, null, sinon.spy());

      handlers.person({
        params: {id},
        auth: requestNoAuth.auth
      }, reply);

      assert.calledWith(errorMapper.mapToResponse, err, reply);
    });
  });
});
