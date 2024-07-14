const read = require('./controller/read');

read((err, block) => {
  if (err)
    return console.error(err);

  console.log(block);
});

// const write = require('./controller/write');

// write('dGVzdAo=', (err, response) => {
//   if (err)
//     return console.error(err);

//   console.log(response);
// });