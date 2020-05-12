import 'newrelic';

import Glue from 'glue';
import manifest from './manifest';

require('dotenv-safe').config();

export default Glue.compose(manifest, {relativeTo: __dirname}).then(server => server.start(() => {
  server.log(`Server started at http://${server.info.address}:${server.info.port}`);
  return server;
})).catch(err => {
  console.error(err);         // eslint-disable-line no-console
  console.trace();            // eslint-disable-line no-console
});
