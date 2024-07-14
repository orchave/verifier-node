// Write the given data to local file database with the given key

const fs = require('fs');
const path = require('path');

const PATH = path.join(__dirname, '../data.txt');

module.exports = (key, data, callback) => {
  fs.readFile(PATH, (err, _file) => {
    if (err) return callback('fs_read_error');

    try {
      const file = JSON.parse(_file);
      file[key] = data;

      fs.writeFile(PATH, JSON.stringify(file), err => {
        if (err) return callback('fs_read_error');
    
        return callback(null);
      });
    } catch (_) {
      return callback('json_parse_error');
    };
  });
};