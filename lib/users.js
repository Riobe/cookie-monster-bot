'use strict';

const data = require('./data');

function makeUser(user) {
  return Object.assign({}, {
    cookies: 0,
    baked: 0,
    lastBaked: undefined,
    cookiesFrom: {},
    cookiesTo: {} 
  }, {
    user: {
      id: user.id,
      username: user.username,
      mention: user.toString()
    }
  });
};

exports.getUser = function (user) {
  // Default the value in the store and pull a reference.
  const userData = data[user.id] = data[user.id] || makeUser(user);

  return userData;
};
