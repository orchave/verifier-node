const readAvail = require('../../avail/controller/read');
const writeAvail = require('../../avail/controller/write');

const readDatabase = require('../../database/functions/read');
const writeDatabase = require('../../database/functions/write');

const verifyBlock = require('../../utils/verifyBlock');

module.exports = (callback) => {
  readAvail((err, latest_block) => {
    if (err) return callback(err);

    const block = verifyBlock(latest_block);

    if (!block) return callback();

    readDatabase('avail_latest_block', (err, latest_saved_block) => {
      if (latest_saved_block.filecoin_cid == block.filecoin_cid)
        return callback();

      writeDatabase('avail_latest_block', JSON.stringify(block), err => {
        if (err) return callback(err);

        writeAvail(block, err => {
          if (err) return callback(err);

          callback();
        });
      });
    });
  });
}