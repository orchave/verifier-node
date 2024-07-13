const { initialize, getKeyringFromSeed } = require('avail-js-sdk');

const RPCConfig = require('../RPCConfig');

module.exports = (data, callback) => {
  if (!data)
    return callback('bad_request');

  initialize(RPCConfig.endpoint, (err, initializedAPI) => {
    if (err)
      return callback(rpc_connection_error);

    const userAccount = getKeyringFromSeed(RPCConfig.seed);
    const appID = RPCConfig.appID == 0 ? 1 : RPCConfig.appID;

    initializedAPI.tx.dataAvailability
      .submitData(data)
      .signAndSend(userAccount, {
        app_id: appID,
        nonce: -1
      }, txResult => {
        if (!txResult.isFinalized && !txResult.isError)
          return callback('unknown_error');

        if (txResult.isError)
          return callback('tx_failed');

        const blockHash = txResult.status.asFinalized.toString();
        const txHash = txResult.txHash.toString();

        const possibleTxError = txResult.dispatchError;
        if (possibleTxError) {
          if (possibleTxError.isModule) {
            const decodedError = initializedAPI.registry.findMetaError(possibleTxError.asModule);
            const { documentation, name, section } = decodedError;

            return callback('tx_failed', {
              success: false,
              blockHash,
              documentation,
              name,
              section,
              txHash
            });
          } else {
            return callback('tx_failed', {
              success: false,
              blockHash,
              name: possibleTxError.toString(),
              section: 'unknown',
              txHash
            });
          };
        };

        return callback(null, {
          success: true,
          blockHash,
          txHash
        });
      });
  });
};