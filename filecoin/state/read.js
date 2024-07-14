const { NodejsProvider } = require('@filecoin-shipyard/lotus-client-provider-nodejs');
const { LotusClient } = require('@filecoin-shipyard/lotus-client-rpc');
const schema = require('@filecoin-shipyard/lotus-client-schema');

// Replace with your Lotus node API endpoint
const API_URL = procces.env.API_URL; 

async function getStateByCID(cid) {
  // Connect to the Lotus node
  const provider = new NodejsProvider(API_URL);
  const client = new LotusClient(provider, schema);

  try {
    // Retrieve the state by CID
    const state = await client.clientStateGet(cid);
    console.log('State:', state);
  } catch (error) {
    console.error('Error retrieving state:', error);
  } finally {
    // Close the provider connection
    await provider.close();
  }
}
