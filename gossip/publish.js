// Publish gossip to the network

const fetch = require('node-fetch');

const readDatabase = require('../database/functions/read');

const getFileFromFilecoinAndSign = require('../utils/getFileFromFilecoinAndSign');
const verifyGossip = require('../utils/verifyGossip');

const FVM_PUBLIC_KEY = process.env.FVM_PUBLIC_KEY;

module.exports = (_gossip, callback) => {
  const gossip = verifyGossip(_gossip);

  if (!gossip) return callback('bad_request');

  getFileFromFilecoinAndSign(gossip.filecoin_cid, (err, signature) => {
    if (err) return callback(err);

    const newGossip = {
      id: gossip.id,
      filecoin_cid: gossip.filecoin_cid,
      verifiers: gossip.verifiers.push({
        publicKey: FVM_PUBLIC_KEY,
        signature
      })
    };

    readDatabase('verifier_addresses', (err, verifier_addresses) => {
      if (err) return callback(null);
      if (!verifier_addresses || !verifier_addresses.length)
        return callback(null);

      verifier_addresses.forEach(async address => {
        await fetch(address, {
          method: 'POST',
          body: JSON.stringify(newGossip)
        }).catch(console.log);
      });

      return callback();
    });
  });
};