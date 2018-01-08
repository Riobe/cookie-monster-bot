'use strict';

const fs = require('fs');

const DatabaseEntry = require('../models/database-entry');

const data = JSON.parse(fs.readFileSync('./save-data.json'));
Object.keys(data).forEach(id => {
  data[id] = new DatabaseEntry(data[id]);
});

const TEN_SECONDS = 10 * 1000; // 1000 milliseconds
setInterval(() => {
  fs.writeFile('./save-data.json', JSON.stringify(data), 'utf8', err => {
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
    entry = new DatabaseEntry(user);
    data[user.id] = entry;
  }

  return entry;
};

exports.getUserById = function(userId) {
  return exports.getUser({ id: userId });
};

exports.giveCookies = function(fromUser, toUser, amount) {
  const from = exports.getUser(fromUser);

  if (from.cookies < amount) {
    throw new Error('Cannot give that many cookies!');
  }

  const to = exports.getUser(toUser);
  
  from.giveCookiesTo(to, amount);
};

exports.giveCookiesMultiple = function(fromUser, toUsers, amount) {
  const from = exports.getUser(fromUser);

  if ((from.cookies * amount) < toUsers.length) {
    throw new Error('Cannot give that many cookies!');
  }

  const recipients = toUsers.map(exports.getUser);

  recipients.forEach(recipient => from.giveCookiesTo(recipient, amount));

  return recipients;
};
