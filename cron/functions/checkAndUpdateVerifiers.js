const readDatabase = require('../../database/functions/read');
const writeDatabase = require('../../database/functions/write');

const readFilecoinState = require('../../filecoin/state/read');

module.exports = callback => {
  readDatabase('verifiers_list', (err, verifiers) => {
    if (err) return callback(err);

    if (!Array.isArray(verifiers))
      verifiers = [];

    readFilecoinState('verifiers', (err, filecoin_verifiers) => {
      if (err) return callback(err);

      filecoin_verifiers.forEach(verifier => {
        if (!verifiers.includes(verifier))
          verifiers.push(verifier);
      });

      try {
        writeDatabase('verifiers_list', JSON.stringify(verifiers), err => {
          if (err) return callback(err);
  
          callback();
        });
      } catch (_) {
        return callback('json_stringify_error');
      };
    });
  });
};