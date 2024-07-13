const fs = require('fs');

module.exports = (key, data, callback) => {
  fs.readFile('../data.txt', (err, _file) => {
    if (err) return callback('fs_read_error');
  
    try {
      const file = JSON.parse(_file);
      file[key] = data;

      fs.writeFile('../data.json', JSON.stringify(file), err => {
        if (err) return callback('fs_read_error');
    
        return callback(null);
      });
    } catch (_) {
      return callback('json_parse_error');
    };
  });
};