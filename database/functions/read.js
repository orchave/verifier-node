const fs = require('fs');

module.exports = (key, callback) => {
  fs.readFile('../data.json', (err, _file) => {
    if (err) return callback('fs_read_error');

    try {
      const file = JSON.parse(_file);

      if (!file[key]) return callback('data_key_not_found');

      return callback(null, file[key]);
    } catch (_) {
      return callback('json_parse_error');
    };
  });
};