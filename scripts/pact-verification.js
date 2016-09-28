import pact from '@pact-foundation/pact-node';
require('dotenv').config({silent: true});

pact.verifyPacts({
    providerBaseUrl: 'http://localhost:3000',          // Running API provider host endpoint. Required.
    pactUrls: [
        // path.resolve(__dirname, '../pacts/travi.org-admin.json')
        'https://pact-api.travi.org/pacts/provider/travi-api/consumer/travi.org-admin/latest'
    ],                                  // Array of local Pact file paths or Pact Broker URLs (http based). Required.
    // providerStatesUrl: <String>,        // URL to fetch the provider states for the given provider API. Optional.
    // providerStatesSetupUrl: <String>,   // URL to send PUT requests to setup a given provider state. Optional.
    pactBrokerUsername: process.env.PACT_BROKER_USER,       // Username for Pact Broker basic authentication. Optional
    pactBrokerPassword: process.env.PACT_BROKER_PASSWORD    // Password for Pact Broker basic authentication. Optional
}).catch((e) => {
    console.error(e);           //eslint-disable-line no-console
    pact.removeAllServers();
});
