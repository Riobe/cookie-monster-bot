'use strict';

const fs = require('fs');
const inspect = require('util').inspect;

const TEN_SECONDS = 10 * 1000; // 1000 milliseconds

const data = JSON.parse(fs.readFileSync('./save-data.json'));
setInterval(() => {
  fs.writeFile('./save-data.json', JSON.stringify(data), 'utf8', err => {
    if (err) {
      console.error('Can\'t save to file!!!');
      console.error(err);
    }
  });
}, TEN_SECONDS);


module.exports = data;
