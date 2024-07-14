// Read from local file database with the given key

const fs = require('fs');
const path = require('path');

const PATH = path.join(__dirname, '../data.txt');

module.exports = (key, callback) => {
  fs.readFile(PATH, (err, _file) => {
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