const bodyParser = require('body-parser');
const cluster = require('cluster');
const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const numCPUs = process.env.WEB_CONCURRENCY || require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++)
    cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();
  const server = http.createServer(app);

  const MAX_SERVER_UPLOAD_LIMIT = 52428800;
  const MAX_SERVER_PARAMETER_LIMIT = 50000;
  const PORT = process.env.PORT || 10101;

  const Job = require('./cron/Job');

  const gossipGetController = require('./gossip/get');

  app.use(bodyParser.json({ limit: MAX_SERVER_UPLOAD_LIMIT }));
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: MAX_SERVER_UPLOAD_LIMIT,
    parameter: MAX_SERVER_PARAMETER_LIMIT
  }));

  app.use((req, res, next) => {
    if (!req.query || typeof req.query != 'object')
      req.query = {};
    if (!req.body || typeof req.body != 'object')
      req.body = {};

    next();
  });

  app.get('/gossip', gossipGetController);

  const abiEncodeStringArray = require('./utils/abiEncodeStringArray');
  const hashUTF8 = require('./utils/hashUTF8');
  const MerkleTree = require('./merkle-tree/MerkleTree');

  const array = ['a', 'b', 'c'];
  const index = 2;

  console.log("here");

  MerkleTree.createTree(array, (err, id) => {
    if (err) return console.error(err);

    console.log(id);

    MerkleTree.generateWitness(id, index, (err, witness) => {
      if (err) return console.error(err);

      console.log(witness);

      MerkleTree.generateRootFromWitness(array[index], witness, (err, generateRoot) => {
        if (err) return console.error(err);

        MerkleTree.getRoot(id, (err, root) => {
          if (err) return console.error(err);

          console.log(generateRoot, root);
        });
      });
    });
  });

  server.listen(PORT, () => {
    if (cluster.worker.id == 1)
      Job.start(() => {
        console.log(`Cron Jobs are started on Worker ${cluster.worker.id}`);
      });

    console.log(`Server is on port ${PORT} as Worker ${cluster.worker.id} running @ process ${cluster.worker.process.pid}`);
  });
}
