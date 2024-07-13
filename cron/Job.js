const cron = require('node-cron');

const checkAvail = require('./functions/checkAvail');

const AVAIL_CHECK_TIME = process.env.AVAIL_CHECK_TIME || '*/5 * * * *';

module.exports = Job = {
  start: callback => {
    const checkAvail = cron.schedule(AVAIL_CHECK_TIME, checkAvail);

    checkAvail.start();
    callback();
  }
};