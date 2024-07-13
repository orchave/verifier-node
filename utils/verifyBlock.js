const BLOCK_CONFIG = {
  id: {
    type: 'string',
    equals: 'orchave_verification_request'
  },
  filecoin_cid: {
    type: 'string'
  }
};

module.exports = block => {
  try {
    if (!block) return null;

    if (typeof block == 'string')
      block = JSON.parse(block);

    if (typeof block != 'object') return null

    const newBlock = {};

    for (const key in BLOCK_CONFIG) {
      if (BLOCK_CONFIG[key].type && typeof block[key] != BLOCK_CONFIG[key].type)
        return null

      if (BLOCK_CONFIG[key].equals && block[key] != BLOCK_CONFIG[key].equals)
        return null

      newBlock[key] = block[key];
    };

    return newBlock;
  } catch (_) {
    return null;
  }
}