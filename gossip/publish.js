// Publish gossip to the network

const fetch = require('node-fetch');

const readDatabase = require('../../database/functions/read');

module.exports = (_data, callback) => {
  if (!_data || typeof _data != 'string')
    return callback('bad_request');

  try {
    const data = JSON.parse(_data);

    readDatabase('verifiers_list', (err, verifiers) => {
      if (err) return callback(null); // If verifiers not found
      if (!verifiers || !verifiers.length)
        return callback(null);

      verifiers.forEach(async verifier => {
        await fetch(verifier, {
          method: 'POST',
          body: JSON.stringify(data)
        }).catch(console.log);
      });

      return callback();
    });
  } catch (_) {
    return callback('json_parse_error');
  };
};