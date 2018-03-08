'use strict';

const fs = require('fs');
const winston = require('winston');

const DatabaseEntry = require('../models/database-entry');

const data = JSON.parse(fs.readFileSync('./save-data.json'));
Object.keys(data).forEach(id => {
  data[id] = new DatabaseEntry(data[id]);
});

const TEN_SECONDS = 10 * 1000; // 1000 milliseconds
setInterval(() => {
  winston.silly('Saving data.');
  fs.writeFile('./save-data.json', JSON.stringify(data, null, 2), 'utf8', err => {
    if (err) {
      winston.error('Can\'t save to file!!!', { error: err });
      console.error(err);
    }
  });
}, TEN_SECONDS);

exports.getUser = function(user) {
  if (!user.id) {
    winston.error('Tried to get user without providing  id', { user: user });
    throw new Error('Cannot get entry with a user that has no ID!');
  }

  let entry = data[user.id];
  if (!entry) {
    winston.info('Making new entry for:', user);
    entry = new DatabaseEntry(user);
    data[user.id] = entry;
  }

  winston.silly(`Found user ${entry.user.username}`);
  return entry;
};

exports.getUserById = function(userId) {
  winston.debug(`Getting user for id: ${userId}`);
  return exports.getUser({ id: userId });
};
