const cron = require('node-cron');

const checkAndUpdateVerifiers = require('./functions/checkAndUpdateVerifiers');
const checkAvail = require('./functions/checkAvail');

const AVAIL_CHECK_TIME = process.env.AVAIL_CHECK_TIME || '*/5 * * * *';
const VERIFIERS_CHECK_TIME = process.env.VERIFIERS_CHECK_TIME || '0 * * * *';

module.exports = Job = {
  start: callback => {
    const checkAndUpdateVerifiersTask = cron.schedule(VERIFIERS_CHECK_TIME, checkAndUpdateVerifiers);
    const checkAvailTask = cron.schedule(AVAIL_CHECK_TIME, checkAvail);

    checkAndUpdateVerifiersTask.start();
    checkAvailTask.start();

    callback();
  }
};