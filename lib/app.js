import 'newrelic';

import Glue from 'glue';
import manifest from './manifest';

require('dotenv-safe').config();

module.exports = new Promise((resolve, reject) => {
  Glue.compose(manifest, {relativeTo: __dirname}, (err, server) => {
    if (err) {
      reject(err);
      throw err;
    }

    server.start(() => {
      /* eslint-disable no-console */
      console.log(`Server started at http://${server.info.address}:${server.info.port}`);
      /* eslint-enable no-console */

      resolve(server);
    });
  });
}).catch(err => {
  console.error(err);         // eslint-disable-line no-console
  console.trace();            // eslint-disable-line no-console
});
