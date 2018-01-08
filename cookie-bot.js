'use strict';

const Discord = require('discord.js');

const cookies = require('./lib/cookies');

const client = new Discord.Client();

client.login('Mzk4NjI2OTY4NDg2MTUwMTQ0.DTBR6Q.ilrbbDRXzbgeLHy8W6PebtA0qEs');

client.on('ready', () => {
  console.log('Running.');
  client.channels.find('name', 'general').send('Hello! Me here in local bakery to talk about COOKIES!!!');
});
client.on('error', err => {
  console.errror(err);
  client.channels.find('name', 'general').send('COOKIE COOKIE COOKIE START WITH C!');
});

process.on('SIGINT', function() {
  console.log('Caught interrupt signal');
  client.channels
    .find('name', 'general')
    .send('COOKIE COOKIE COOKIE START WITH C!')
    .then(() => process.exit());
  //process.exit();
});

client.on('message', message => {
  const content = message.content.trim();

  // One single character check to skip all the rest of the command checks.
  if (content[0] === '!') {
    if (content.startsWith('!bake')) {
      cookies.bakeCookies(message);
    } else if (content.startsWith('!cookiesof')) {
      cookies.listCookies(message);
    } else if (content.startsWith('!cookiehelp')) {
      cookies.cookieHelp(message);
    } else if (content.startsWith('!cookies')) {
      cookies.listOwnCookies(message);
    }
  } else if (content.startsWith(cookies.A_COOKIE)) {
    cookies.giveCookies(message);
  }
});
