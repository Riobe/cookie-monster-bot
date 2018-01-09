'use strict';

const data = require('./data');

const A_COOKIE = '🍪';
exports.A_COOKIE = A_COOKIE;
const MULTI_COOKIE_REGEX = /🍪\s*\*\s*(\d+)/;

exports.bakeCookies = function (message) {
  if (message.mentions.everyone) {
    return message.reply('CANNOT BAKE COOKIES FOR EVERYONE ALL AT SAME TIME!!!');
  }

  const baker = data.getUser(message.author);
  let error = baker.bakeCookies();

  message.reply(error || `YOU HAVE MADE 5 NEW COOKIES!!! I am so happy for you! You have ${baker.cookies.toLocaleString()} cookies now!`);
};


function listCookiesOfUser(message, user) {
  if (message.author.id === user.user.id) {
    let selfReply = `you have ${user.cookies.toLocaleString()} cookies!`;
    if (user.cookies > 0) {
      selfReply += ' I so happy for you!';
    } else {
      selfReply += ' You ate ALL your cookies?!';
    }

    message.reply(selfReply);
  } else {
    message.reply(`${user.user.mention} has ${user.cookies.toLocaleString()} COOKIES!`);
  }
}

exports.listCookies = function(message) {
  if (message.mentions.everyone) {
    return message.reply('you should ask the Count! I not count EVERYONE\'s cookies at same time!!!');
  }

  const mentions = message.mentions.users.array();
  if (mentions.length === 0) {
    return message.reply('I not know who that is... I go back to eating cookies now...');
  }

  if (mentions.length > 1) {
    return message.reply('that too many people. I not the Count!!!');
  }

  const listUser = data.getUser(mentions[0]);

  listCookiesOfUser(message, listUser);
};

exports.listOwnCookies = function(message) {
  if (message.mentions.everyone) {
    return message.reply('you should ask the Count! I not count EVERYONE\'s cookies at same time!!!');
  }

  const ownUser = data.getUser(message.author);

  listCookiesOfUser(message, ownUser);
};

exports.giveCookies = function(message) {
  if (message.mentions.everyone) {
    return message.reply('COOKIES ARE IMPORTANT! DO NOT JUST THROW EVERYWHERE!');
  }

  // No cheating!
  if (message.mentions.users.has(message.author.id)) {
    return message.reply('you already have cookies! Are you trying to cheat?! I SHOULD EAT YOUR COOKIES!!!');
  }

  const toUserCount = message.mentions.users.array().length;

  if (!toUserCount) {
    return message.reply('...who you want to give cookies to?');
  }

  const sender = data.getUser(message.author);

  // Allow multiple cookies.
  let cookieAmount = 1;
  const multiCookieMatch = message.content.match(MULTI_COOKIE_REGEX);
  if (multiCookieMatch) {
    cookieAmount = Number(multiCookieMatch[1]);
  }

  if ((cookieAmount * toUserCount) > sender.cookies) {
    return message.reply(`the Count said you no have enough cookies for that. Remember your ${sender.cookies.toLocaleString()} cookies!`);
  }

  let recipients = data.giveCookiesMultiple(message.author, message.mentions.users.array(), cookieAmount);

  const givenMessage = recipients.map(recipient => `${recipient.user.mention} has ${recipient.cookies.toLocaleString()} cookies!`);
  message.channel.send(givenMessage + `, ${sender.user.mention} has ${sender.cookies.toLocaleString()} left. Mmmmm!`);
};

function getCookieGrammar(user) {
  if (user.cookies === 1)
    return "cookie";
  else
    return "cookies";
};

exports.cookieHelp = function(message) {
  const helpMessage = 
`I can do lots of things!!!
\`\`\`
  !cookies - I will count your cookies!
  !cookiesof <@mention> - I count someone else's cookies!
  !bake - I will help you bake COOKIES! The ovens will get too hot if you do it more than once a day though!
  :cookie: <@mention> - Give someone cookie!
  :cookie: * <number> <@mention> <@mention>- You can even give lots of cookies!!! To more than one person too!
\`\`\``;
  message.reply(helpMessage);
};
