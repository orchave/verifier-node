const readDatabase = require('../database/functions/read');
const writeDatabase = require('../database/functions/write');

const abiEncodeStringArray = require('../utils/abiEncodeStringArray');
const hashUTF8 = require('../utils/hashUTF8');

let tree = [];

function generateTreeId() {
  return Math.random().toString(36).substring(2, 15);
};

function createTreeRecursive(leaves, index) {
  console.log("call");
  console.log(leaves);
  console.log(index);
  if (leaves.length == 0) return null;
  if (leaves.length == 1) {
    tree[index] = hashUTF8(abiEncodeStringArray(leaves));
    return tree[index];
  };

  const n = leaves.length;
  const mid = Math.floor(n / 2);

  const left = createTreeRecursive(leaves.slice(0, mid), 2 * index);
  const right = createTreeRecursive(leaves.slice(mid), 2 * index + 1);

  const node = right ? hashUTF8(abiEncodeStringArray([left, right])) : left;
  tree[index] = node;

  return tree[index];
};

function findWitnessRecursive(index) {
  if (index == 1) return [];

  const witness = index % 2 ? tree[index - 1] : tree[index + 1];

  return [witness, ...findWitnessRecursive(Math.floor(index / 2))];
};

module.exports = {
  createTree: (leaves, callback) => {
    if (!leaves || !Array.isArray(leaves) || !leaves.length)
      return callback('bad_request');

    const n = leaves.length;

    tree = Array.from({ length: 2 * n });

    createTreeRecursive(leaves, 1);

    readDatabase('merkle_tree', (err, data) => {
      if (err) return callback(err);

      const id = generateTreeId();

      data[id] = tree;

      writeDatabase('merkle_tree', data, err => {
        if (err) return callback(err);

        return callback(null, id);
      });
    });
  },
  getRoot: (id, callback) => {
    readDatabase('merkle_tree', (err, data) => {
      if (err) return callback(err);
  
      if (!data[id]) return callback('id_not_found');
  
      return callback(null, data[id][1]);
    });
  },
  generateWitness: (id, index, callback) => {
    readDatabase('merkle_tree', (err, data) => {
      if (err) return callback(err);
      if (!data[id]) return callback('id_not_found');

      tree = data[id];

      return callback(null, findWitnessRecursive(index));
    });
  },
  generateRootFromWitness: (leaf, witness, callback) => {
    let root = abiEncodeStringArray([hashUTF8(leaf)]);

    for (let i = 0; i < witness.length; i++)
      root = hashUTF8(abiEncodeStringArray([root, witness[i]]));

    return callback(null, root);
  }
};
