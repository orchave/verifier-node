const { exec } = require('child_process');

const ClientConfig = require('../ClientConfig');

const getBlockCall = (currentBlock, callback) => {
  exec(`curl --silent ${ClientConfig.rpcEndpoint}/v2/blocks/${currentBlock}/header`, (err, response) => {
    if (err)
      return callback('unknown_error');

    if (response.includes('Not Found'))
      return setTimeout(() => getBlockCall(currentBlock, callback), 3000);

    return callback(null, response);
  });
};

module.exports = callback => {
  let currentBlock = 0;

  setInterval(() => {
    exec(`curl --silent ${ClientConfig.rpcEndpoint}/v2/status`, (err, stderr, stdout) => {
      if (err)
        return callback('rpc_connection_error');

      const response = stdout ? JSON.parse(stdout) : JSON.parse(stderr);

      if (response.blocks.latest > currentBlock) {
        currentBlock = response.blocks.latest;

        getBlockCall(currentBlock, (err, block) => {
          if (err)
            return callback(err);

          return callback(null, JSON.parse(block));
        });
      };
    });
  }, 5000);
};