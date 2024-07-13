const { initialize } = require('avail-js-sdk');

const ClientConfig = require('../ClientConfig.json');

module.exports = callback => {
  initialize(ClientConfig.endpoint, (err, initializedAPI) => {
    if (err)
      return callback('rpc_connection_error');

    initializedAPI.rpc.chain
      .subscribeNewHeads((err, header) => {
        if (err)
          return callback('unknown_error');

        return callback(null, {
          blockHash: header.hash.toString(),
          blockNumber: header.number.toNumber()
        });
      });
  });
};