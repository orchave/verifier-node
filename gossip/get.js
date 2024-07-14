// Publish gossip to the network

const publishGossip = require('./functions/publish');

module.exports = (req, res) => {
  publishGossip(req.body, err => {
    if (err) return res.json({ success: false, error: err });

    return res.json({ success: true });
  });
};