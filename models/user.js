'use strict';

/**
 * User model. Requires id and username.
 */
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

  console.log('I exist now!', JSON.stringify({
    id: newUser.id,
    username: newUser.username,
    mention: `<@${newUser.id}>`
  }, null, 2));
}

module.exports = User;
