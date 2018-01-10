'use strict';

const fs = require('fs');

const DatabaseEntry = require('../models/database-entry');

const data = JSON.parse(fs.readFileSync('./save-data.json'));
Object.keys(data).forEach(id => {
  data[id] = new DatabaseEntry(data[id]);
});

const TEN_SECONDS = 10 * 1000; // 1000 milliseconds
setInterval(() => {
  fs.writeFile('./save-data.json', JSON.stringify(data, null, 2), 'utf8', err => {
    if (err) {
      console.error('Can\'t save to file!!!');
      console.error(err);
    }
  });
}, TEN_SECONDS);

exports.getUser = function(user) {
  if (!user.id) {
    throw new Error('Cannot get entry with a user that has no ID!');
  }

  let entry = data[user.id];
  if (!entry) {
    console.log('Making new entry for:', user);
    entry = new DatabaseEntry(user);
    data[user.id] = entry;
  }

  return entry;
};

exports.getUserById = function(userId) {
  return exports.getUser({ id: userId });
};
