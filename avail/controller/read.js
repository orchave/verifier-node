// const { initialize } = require('avail-js-sdk');
const { exec } = require('child_process');

const ClientConfig = require('../ClientConfig');

module.exports = callback => {
  let currentBlock = 0;

  setInterval(() => {
    exec(`curl --silent ${ClientConfig.rpcEndpoint}/v2/status`, (err, response) => {
      if (err)
        return callback('rpc_connection_error');

      console.log(0, JSON.parse(response));

      if (response.blocks.latest > currentBlock) {
        currentBlock = response.blocks.latest;
        console.log(currentBlock);

        exec(`curl --silent ${ClientConfig.rpcEndpoint}/v2/blocks/${currentBlock}/header`, (err, response) => {
          if (err)
            return callback('unknown_error');
          console.log(0, response);

          // const block = response.stdout ? JSON.parse(response.stdout) : JSON.parse(response);

          // return callback(null, block);
        });

        // exec('curl --silent http://

      // const statusResponse = response.stdout ? JSON.parse(response.stdout) : JSON.parse(response);

      // if (statusResponse.blocks.latest > currentBlock) {
      //   currentBlock = statusResponse.blocks.latest;
      //   console.log(currentBlock);

      //   exec(`curl --silent ${ClientConfig.rpcEndpoint}/v2/blocks/${currentBlock}/header`, (err, response) => {
      //     if (err)
      //       return callback('unknown_error');
      //     console.log(0, response);

      //     // const block = response.stdout ? JSON.parse(response.stdout) : JSON.parse(response);

      //     // return callback(null, block);
      //   });

      //   // exec('curl --silent http://127.0.0.1:7000/blocks/' + currentBlock, (err, response) => {
      //   //   if (err)
      //   //     return callback('unknown_error');

      //   //   const block = response.stdout ? JSON.parse(response.stdout) : JSON.parse(response);

      //   //   return callback(null, block);
      //   // });
      // };
    });
  }, 5000);
};


  // initialize(ClientConfig.rpcEndpoint, (err, initializedAPI) => {
  //   if (err)
  //     return callback('rpc_connection_error');

  //   initializedAPI.rpc.chain
  //     .subscribeNewHeads((err, header) => {
  //       if (err)
  //         return callback('unknown_error');

  //       initializedAPI.rpc.chain
  //         .getBlock(header.hash, (err, block) => {
  //           if (err)
  //             return callback('unknown_error');

  //           return callback(null, block);
  //         });
  //     });
  // });