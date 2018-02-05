import deepFreeze from 'deep-freeze';
import any from '../../../helpers/any-for-api';
import routes from '../../../../lib/api/routes';
import controller from '../../../../lib/api/rides/controller';
import * as halaciousConfigurator from '../../../../lib/api/halacious-configurator';
import * as errorMapper from '../../../../lib/api/error-response-mapper';

suite('ride routes', () => {
  const requestNoAuth = deepFreeze({auth: {}});
  const server = {
    route() {
      return undefined;
    }
  };

  setup(() => {
    sinon.stub(server, 'route');
    sinon.stub(errorMapper, 'mapToResponse');
    sinon.stub(halaciousConfigurator, 'default');
  });

  teardown(() => {
    errorMapper.mapToResponse.restore();
    halaciousConfigurator.default.restore();
    server.route.restore();
  });

  suite('list route', () => {
    setup(() => {
      sinon.stub(controller, 'getList');
    });

    teardown(() => {
      controller.getList.restore();
    });

    test('that list route defined correctly', () => {
      const next = sinon.spy();
      const halaciousConfig = any.simpleObject();
      const resourceType = 'rides';
      halaciousConfigurator.default.withArgs(resourceType).returns(halaciousConfig);

      routes.register(server, null, next);

      assert.calledWith(server.route, sinon.match({
        method: 'GET',
        path: `/${resourceType}`,
        config: {
          tags: ['api'],
          plugins: {
            hal: halaciousConfig
          }
        }
      }));
      assert.calledOnce(next);
    });

    test('that the list route gets gets data from controller', () => {
      const reply = sinon.spy();
      const data = {foo: 'bar'};
      controller.getList.yields(null, data);
      server.route.withArgs(sinon.match({path: '/rides'})).yieldsTo('handler', requestNoAuth, reply);

      routes.register(server, null, sinon.spy());

      assert.calledWith(reply, data);
    });

    test('that scopes are passed to controller for request with authorization', () => {
      const reply = sinon.spy();
      const scopes = any.listOf(any.string);
      server.route.withArgs(sinon.match({path: '/rides'})).yieldsTo(
        'handler',
        {auth: {credentials: {scope: scopes}}},
        reply
      );

      routes.register(server, null, sinon.spy());

      assert.calledWith(controller.getList, scopes);
    });

    test('that error mapped when list request results in error', () => {
      const reply = sinon.spy();
      const err = {};
      controller.getList.yields(err);
      server.route.withArgs(sinon.match({path: '/rides'})).yieldsTo('handler', requestNoAuth, reply);

      routes.register(server, null, sinon.spy());

      assert.calledWith(errorMapper.mapToResponse, err, reply);
      refute.called(reply);
    });
  });

  suite('ride route', () => {
    setup(() => {
      sinon.stub(controller, 'getRide');
    });

    teardown(() => {
      controller.getRide.restore();
    });

    test('that individual route defined correctly', () => {
      routes.register(server, null, sinon.spy());

      assert.calledWith(server.route, sinon.match({
        method: 'GET',
        path: '/rides/{id}',
        config: {
          tags: ['api'],
          validate: {
            params: {
              // id: Joi.string().required()
            }
          }
        }
      }));
    });

    test('that ride returned from controller', () => {
      const id = any.integer();
      const reply = sinon.spy();
      const ride = {id};
      controller.getRide.withArgs(id).yields(null, ride);
      server.route.withArgs(sinon.match({path: '/rides/{id}'})).yieldsTo('handler', {params: {id}}, reply);

      routes.register(server, null, sinon.spy());

      assert.calledWith(reply, ride);
    });

    test('that error mapped when ride request results in error', () => {
      const id = any.integer();
      const setContentType = sinon.spy();
      const setResponseCode = sinon.stub().returns({type: setContentType});
      const reply = sinon.stub().withArgs().returns({code: setResponseCode});
      const err = {notFound: true};
      controller.getRide.withArgs(id).yields(err, null);
      server.route.withArgs(sinon.match({path: '/rides/{id}'})).yieldsTo('handler', {params: {id}}, reply);

      routes.register(server, null, sinon.spy());

      assert.calledWith(errorMapper.mapToResponse, err, reply);
    });
  });
});
