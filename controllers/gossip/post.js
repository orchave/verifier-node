const fetch = require('node-fetch');

const readDatabase = require('../../database/functions/read');

module.exports = async (_data, callback) => {
  if (!_data || typeof _data != 'string')
    return callback('bad_request');

  try {
    const data = JSON.parse(_data);

    readDatabase('verifiers_list', (err, verifiers) => {
      if (err) return callback(null); // If verifiers not found
      if (!verifiers || !verifiers.length)
        return callback(null);
    })

    await fetch('https://api.github.com/repos/node101-io/klein/tags')
      .then(res => res.json())
      .then(json => json[0].name.replace('v', ''))
      .catch(console.log);
  } catch (_) {
    return callback('json_parse_error');
  };
};