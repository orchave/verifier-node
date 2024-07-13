const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function hash(string) {
  return crypto.createHash('sha256').update(string).digest('hex');
}

function saveToFile(id, array) {
  const filePath = path.join(__dirname + '/deneme', `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(array));
}

function readFromFile(id) {
  const filePath = path.join(__dirname + '/deneme', `${id}.json`);
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function getRootOfId(id) {
  const tree = readFromFile(id);

  return tree[1];
}

function createTree(leaves) {
  const tree = Array.from( {length: leaves.length * 2} );

  let n = leaves.length

  if (n == 1)
    tree[1] = hash(leaves[0]);
  else if (n == 2)
    tree[1] = hash(leaves[0]) + hash(leaves[1]);
  else {
    for (let i = 0; i < n; i++) {
      tree[n + i + 1] = hash(leaves[i]);
    }
    if (leaves.length % 2 == 0) {
      for (let i = n ; i > 0; i--) {
        tree[i] = hash(tree[i * 2] + tree[i * 2 + 1]);
      }
    }
    else if (leaves.length % 2 != 0) {
      tree[n] = tree[2 * n];

      for (let i = n - 1; i > 0; i--) {
        tree[i] = hash(tree[i * 2] + tree[i * 2 + 1]);
      }
    }
  }

  const id = Math.random().toString(36).substring(2, 15);
  saveToFile(id, tree);
  return id;
}

function generateWitness(id, index){

  const tree = readFromFile(id);
  console.log("********");
  console.log(tree);


  let witnessArray = [];

  if(tree.length == 0)
    return;
  if (tree.length == 1)
    return witnessArray;

  let n = index;

  while (n > 1) {
    if (n % 2 === 0) {
      witnessArray.push(tree[n + 1]);
    } else {
      witnessArray.push(tree[n - 1]);
    }
    n = Math.floor(n / 2);
  }

  return witnessArray;
}


const leaves = ['a', 'b', 'c'];
const treeId = createTree(leaves);
console.log('Tree ID:', treeId);
console.log('Root:', getRootOfId(treeId));
console.log('Witness:', generateWitness(treeId, 1));
