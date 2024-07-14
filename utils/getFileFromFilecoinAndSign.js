const crypto = require('crypto');

const readFileFromFilecoin = require('../filecoin/file/read');

const FVM_PRIVATE_KEY = process.env.FVM_PRIVATE_KEY;

module.exports = (cid, callback) => {
  readFileFromFilecoin(cid, (err, file) => {
    if (err) return callback(err);

    try {
      const sign = crypto.createSign('SHA256');
      sign.write(JSON.stringify(file));
      sign.end();

      const signature = sign.sign(FVM_PRIVATE_KEY, 'hex');

      return callback(null, signature);
    } catch (_) {
      return callback('json_stringify_error');
    };
  });
};