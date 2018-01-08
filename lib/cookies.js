'use strict';

const users = require('./users');

const A_COOKIE = '🍪';
exports.A_COOKIE = A_COOKIE;
const MULTI_COOKIE_REGEX = /🍪\s*\*\s*(\d+)/

exports.bakeCookies = function (message) {
  if (message.mentions.everyone) {
    return message.reply('CANNOT BAKE COOKIES FOR EVERYONE ALL AT SAME TIME!!!');
  }

  const baker = users.getUser(message.author);

  const now = new Date();

  if (baker.lastBaked && now.toLocaleDateString('en-US') === baker.lastBaked) {
    return message.reply(' your oven is too hot! EAT COOKIES INSTEAD UNTIL TOMORROW! Mmffmfffmfmff Mmmmmmmmm....');
  }

  baker.cookies += 5;
  baker.baked += 5;
  baker.lastBaked = (new Date()).toLocaleDateString('en-US');

  message.reply(`YOU HAVE MADE 5 NEW COOKIES!!! I am so happy for you! You have ${baker.cookies.toLocaleString()} cookies now!`);
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

  const otherUser = users.getUser(mentions[0]);

  listCookiesOfUser(message, otherUser);
};

exports.listOwnCookies = function(message) {
  if (message.mentions.everyone) {
    return message.reply('you should ask the Count! I not count EVERYONE\'s cookies at same time!!!');
  }

  const selfUser = users.getUser(message.author);

  listCookiesOfUser(message, selfUser);
};

exports.giveCookies = function(message) {
  if (message.mentions.everyone) {
    return message.reply('COOKIES ARE IMPORTANT! DO NOT JUST THROW EVERYWHERE!');
  }

  // No cheating!
  if (message.mentions.users.has(message.author.id)) {
    return message.reply('you already have cookies! Are you trying to cheat?! I SHOULD EAT YOUR COOKIES!!!');
  }

  let sender = users.getUser(message.author);
  const toUserCount = message.mentions.users.array().length;

  if (!toUserCount) {
    return message.reply('...who you want to give cookies to?');
  }

  // Allow multiple cookies.
  let cookieAmount = 1;
  const multiCookieMatch = message.content.match(MULTI_COOKIE_REGEX);
  if (multiCookieMatch) {
    cookieAmount = Number(multiCookieMatch[1]);
  }

  if ((cookieAmount * toUserCount) > sender.cookies) {
    return message.reply(`the Count said you no have enough cookies for that. Remember your ${sender.cookies.toLocaleString()} cookies!`);
  }

  // Keep track of cookies given as we go.
  const givenCookies = [];
  message.mentions.users.array().forEach(mention => {
    const recipient = users.getUser(mention);

    // Give cookies!
    recipient.cookies += cookieAmount;
    sender.cookies -= cookieAmount;

    // Find the user it came from, and track that they gave.
    const cookiesFrom = recipient.cookiesFrom[sender.user.id] || {
      user: sender.user,
      cookies: 0
    };
    cookiesFrom.cookies += cookieAmount;
    recipient.cookiesFrom[sender.user.id] = cookiesFrom;

    // Track that the cookies were given too!
    const cookiesTo = sender.cookiesTo[recipient.user.id] || {
      user: recipient,
      cookies: 0
    };
    cookiesTo.cookies += cookieAmount;
    sender.cookiesTo[recipient.user.id] = cookiesTo;

    // Little message with the new amount.
    givenCookies.push(`${recipient.user.mention} has ${recipient.cookies.toLocaleString()} cookies!`);
  });

  message.channel.send(givenCookies.join(' ') + `, ${sender.user.mention} has ${sender.cookies.toLocaleString()} left. Mmmmm!`);
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
