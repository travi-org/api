import Joi from 'joi';
import personsController from './persons/controller';
import ridesController from './rides/controller';
import {mapToResponse} from './error-response-mapper';
import configureHalaciousFor from './halacious-configurator';

function returnResourceIfExists(resource, reply, err) {
  if (err) {
    mapToResponse(err, reply);
  }

  if (resource) {
    reply(resource);
  }
}

function defineListRouteFor(resourceType, controller) {
  return {
    method: 'GET',
    path: `/${resourceType}`,
    handler(request, reply) {
      let scopes;

      if (request.auth.credentials) {
        scopes = request.auth.credentials.scope;
      }

      controller.getList(scopes, (err, data) => {
        if (err) {
          mapToResponse(err, reply);
        } else {
          reply(data);
        }
      });
    },
    config: {
      tags: ['api'],
      plugins: {
        hal: configureHalaciousFor(resourceType)
      }
    }
  };
}

export const plugin = {
  async register(server) {
    server.route(defineListRouteFor('persons', personsController));
    server.route(defineListRouteFor('rides', ridesController));

    server.route({
      method: 'GET',
      path: '/persons/{id}',
      handler(request, reply) {
        let scopes;

        if (request.auth.credentials) {
          scopes = request.auth.credentials.scope;
        }

        personsController.getPerson(request.params.id, scopes, (err, person) => {
          returnResourceIfExists(person, reply, err);
        });
      },
      config: {
        tags: ['api'],
        validate: {
          params: {
            id: Joi.string().required()
          }
        }
      }
    });

    server.route({
      method: 'GET',
      path: '/rides/{id}',
      handler(request, reply) {
        ridesController.getRide(parseInt(request.params.id, 10), (err, ride) => {
          returnResourceIfExists(ride, reply, err);
        });
      },
      config: {
        tags: ['api'],
        validate: {
          params: {
            id: Joi.string().required()
          }
        }
      }
    });
  },
  name: 'routes'
};
