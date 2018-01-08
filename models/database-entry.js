'use strict';

const User = require('./user');

function DatabaseEntry(data) {
  this.user = data.user;
  this.cookies = data.cookies || 0;
  this.baked = data.baked || 0;
  this.lastBaked = data.lastBaked || undefined;
  this.cookiesFrom = data.cookiesFrom || {};
  this.cookiesTo = data.cookiesTo || {};

  if (!this.user && (data.id && data.username)) {
    this.user = new User(data);
  }
}

DatabaseEntry.prototype.giveCookiesTo = function(entry, amount) {
  if (this.cookies < amount) {
    throw new Error('Cannot give that many cookies!');
  }

  let cookiesTo = this.cookiesTo[entry.user.id];
  if (!cookiesTo) {
    cookiesTo = {
      user: entry.user,
      cookies: 0
    };
    this.cookiesTo[entry.user.id] = cookiesTo;
  }

  let cookiesFrom = entry.cookiesFrom[this.user.id];
  if (!cookiesFrom) {
    cookiesFrom = {
      user: this.user,
      cookies: 0
    };
    entry.cookiesFrom[this.user.id] = cookiesFrom;
  }

  cookiesTo.cookies += amount;
  cookiesFrom.cookies += amount;

  this.cookies -= amount;
  entry.cookies += amount;
};

DatabaseEntry.prototype.bakeCookies = function() {
  const today = new Date().toLocaleDateString('en-US');

  if (this.lastBaked && today === this.lastBaked) {
    return ' your oven is too hot! EAT COOKIES INSTEAD UNTIL TOMORROW! Mmffmfffmfmff Mmmmmmmmm....';
  }

  this.cookies += 5;
  this.baked += 5;
  this.lastBaked = today;
};

module.exports = DatabaseEntry;
