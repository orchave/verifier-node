// const { initialize, getKeyringFromSeed } = require('avail-js-sdk');
const { exec } = require('child_process');

const ClientConfig = require('../ClientConfig');

module.exports = (data, callback) => {
  if (!data)
    return callback('bad_request');

  exec(`curl -XPOST ${ClientConfig.rpcEndpoint}/v2/submit --header "Content-Type: application/json" --data '{"data":"${data}"}'`,
    (err, response) => {
    if (err)
      return callback(err);

    return callback(null, JSON.parse(response));
  });
};