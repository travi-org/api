import {Verifier} from 'pact';
import {defaultPort} from '../lib/manifest';

require('dotenv').config({silent: true});

Verifier.verifyProvider({
  pactBrokerUrl: 'https://pact-api.travi.org/',
  pactBrokerUsername: process.env.PACT_BROKER_USER,
  pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
  providerBaseUrl: `http://0.0.0.0:${defaultPort}`,
  provider: 'travi-api',
  logLevel: 'debug',
  providerVersion: process.env.TRAVIS_COMMIT,
  publishVerificationResult: true
})
  .then(foo => console.log({foo}))        // eslint-disable-line no-console
  .catch(err => console.log({err}));      // eslint-disable-line no-console
