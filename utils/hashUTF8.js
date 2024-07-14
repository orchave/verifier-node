const crypto = require('crypto');

module.exports = str => {
  if (!str || typeof str != 'string' || !str.length)
    return null;

  return crypto.createHash('sha256').update(str).digest('hex');
};