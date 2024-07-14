const crypto = require('crypto');

const readStateFromFilecoin = require('../filecoin/state/read');

function verifySignature(publicKey, signature, data) {
  const verify = crypto.createVerify('SHA256');
  verify.write(data);
  verify.end();

  return verify.verify(publicKey, signature, 'hex');
};

module.exports = (verifiers, data, callback) => {
  if (!verifiers || !Array.isArray(verifiers))
    return callback(null, []);

  const validVerifiers = [];

  readStateFromFilecoin('verifiers', (err, filecoin_verifiers) => {
    if (err) return callback(err);

    verifiers.forEach(verifier => {
      if (
        typeof verifier == 'object' && verifier.publicKey && typeof verifier.publicKey == 'string' && verifier.signature && typeof verifier.signature == 'string' &&
        filecoin_verifiers.includes(verifier.publicKey) &&
        verifySignature(verifier.publicKey, verifier.signature, data)
      )
        validVerifiers.push(verifier);
    });

    return callback(null, validVerifiers);
  });
};