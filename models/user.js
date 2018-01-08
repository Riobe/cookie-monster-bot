'use strict';

function User(newUser) {
  if (!newUser.id) {
    throw new Error('Cannot create a user without an ID!');
  }

  if (!newUser.username) {
    throw new Error('Cannot create a user without a username!');
  }

  this.id = newUser.id;
  this.username = newUser.username;
  this.mention = `<@${newUser.id}>`;
}

module.exports = User;
