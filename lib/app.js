import 'newrelic';

import Glue from 'glue';
import manifest from './manifest';

module.exports = new Promise((resolve, reject) => {
  Glue.compose(manifest, {relativeTo: __dirname}, (err, server) => {
    if (err) {
      reject(err);
      throw err;
    }

    server.start(() => {
      console.log(            // eslint-disable-line no-console
        `Server started at http://${server.info.address}:${server.info.port}`
      );

      resolve(server);
    });
  });
}).catch(err => {
  console.error(err);         // eslint-disable-line no-console
  console.trace();            // eslint-disable-line no-console
});
