const encode = require('@metamask/abi-utils').encode;
const bytesToHex = require('@metamask/utils').bytesToHex;

module.exports = array => {
  if (!array || !Array.isArray(array) || !array.length || array.find(any => typeof any != 'string'))
      return null;

  return bytesToHex(encode(Array.from({ length: array.length }, _ => 'string'), array));
};