const GOSSIP_CONFIG = {
  id: {
    type: 'string',
    equals: 'orchave'
  },
  filecoin_cid: {
    type: 'string'
  },
  verifiers: {
    type: 'array'
  }
};

module.exports = gossip => {
  try {
    if (!gossip) return null;

    if (typeof gossip == 'string')
      gossip = JSON.parse(gossip);

    if (typeof gossip != 'object') return null;

    const newGossip = {};

    for (const key in GOSSIP_CONFIG) {
      if (GOSSIP_CONFIG[key].type && (
        GOSSIP_CONFIG[key].type != typeof gossip[key] ||
        GOSSIP_CONFIG[key].type == 'array' && !Array.isArray(gossip[key])
      ))
        return null;

      if (GOSSIP_CONFIG[key].equals && gossip[key] != GOSSIP_CONFIG[key].equals)
        return null;

      newGossip[key] = gossip[key];
    };

    return newGossip;
  } catch (_) {
    return null;
  }
}