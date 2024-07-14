const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;

module.exports = (data, callback) => {
  if (!data || typeof data !== 'object')
    return callback('bad_request');

  if (!data.contract_address || typeof data.contract_address != 'string' || !data.contract_address.trim().length || data.contract_address.trim().lenght > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.network || typeof data.network != 'string' || !data.network.trim().length || data.network.trim().length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.proposal_id || typeof data.proposal_id != 'string' || !data.proposal_id.trim().length || data.proposal_id.trim().length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return callback('bad_request');


};