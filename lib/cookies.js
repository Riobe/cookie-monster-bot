'use strict';

const winston = require('winston');
const data = require('./data');

exports.bakeCookies = function (message) {
  if (message.mentions.everyone) {
    winston.info(`${message.author} tried to bake for everyone.`);
    return message.reply('CANNOT BAKE COOKIES FOR EVERYONE ALL AT SAME TIME!!!');
  }

  winston.info(`Baking cookies for ${message.author}`);

  const baker = data.getUser(message.author);
  let error = baker.bakeCookies();

  if (error) {
    winston.warn('User got error while baking.', { error: error });
  }

  message.reply(error || `YOU HAVE MADE 5 NEW COOKIES!!! I am so happy for you! You have ${baker.cookies.toLocaleString()} cookies now!`);
};

exports.eatCookie = function (message) {
  const user = data.getUser(message.author);

  if(user.cookies.length < 1) {
    winston.info(`${message.author} tried to eat a cookie, but they had none (length=0).`);
    return message.reply('YOU HAVE NO COOKIES!! WHY YOU NO HAVE COOKIES?? CANNOT EAT COOKIES!!  YOU SHOULD BE SAD.');
  }

  user.cookies--;

  winston.info(`${message.author} ate a cookie. ${user.cookies.toLocaleString()} cookies remain for them ...`);
  message.reply(`COOKIE! NOM NOM NOM NOM!  YOU HAVE ${user.cookies.toLocaleString()} ${getCookieGrammar(user).toUpperCase()} LEFT!`);
};

function listCookiesOfUser(message, user) {
  winston.info(`Listing cookie count for ${user}`);
  if (message.author.id === user.user.id) {
    let selfReply = `you have ${user.cookies.toLocaleString()} ${getCookieGrammar(user).toUpperCase()}!`;
    if (user.cookies > 0) {
      selfReply += ' I so happy for you!';
    } else {
      selfReply += ' You ate ALL your cookies?!';
    }

    winston.debug('Cookie listing was for self.', { reply: selfReply });
    message.reply(selfReply);
  } else {
    message.reply(`${user.user.username} has ${user.cookies.toLocaleString()} ${getCookieGrammar(user).toUpperCase()}!`);
  }
}

exports.listCookies = function(message) {
  if (message.mentions.everyone) {
    winston.info(`${message.author} tried to list everyone's cookies.`);
    return message.reply('you should ask the Count! I not count EVERYONE\'s cookies at same time!!!');
  }

  const mentions = message.mentions.users.array();
  if (mentions.length === 0) {
    winston.info(`${message.author} tried to list no one's cookies.`);
    return message.reply('I not know who that is... I go back to eating cookies now...');
  }

  if (mentions.length > 1) {
    winston.info(`${message.author} tried to list too many people's cookies.`);
    return message.reply('that too many people. I not the Count!!!');
  }

  const listUser = data.getUser(mentions[0]);
  winston.info(`${message.author} is listing ${listUser}'s cookies.`);

  listCookiesOfUser(message, listUser);
};

exports.listOwnCookies = function(message) {
  if (message.mentions.everyone) {
    winston.info(`${message.author} is listing own cookies with everyone mention.`);
    return message.reply('you should ask the Count! I not count EVERYONE\'s cookies at same time!!!');
  }

  const ownUser = data.getUser(message.author);
  winston.info(`${message.author} is listing own cookies.`);

  listCookiesOfUser(message, ownUser);
};

exports.giveCookies = function(message, gifts) {
  if (message.mentions.everyone) {
    winston.info(`${message.author} tried to give cookies to everyone.`);
    return message.reply('COOKIES ARE IMPORTANT! DO NOT JUST THROW EVERYWHERE!');
  }

  // No cheating!
  if (message.mentions.users.has(message.author.id)) {
    winston.info(`${message.author} tried to give cookies to themselves.`);
    return message.reply('you already have cookies! Are you trying to cheat?! I SHOULD EAT YOUR COOKIES!!!');
  }

  const sender = data.getUser(message.author);

  const outgoingCookies = gifts
    .map(gift => gift.amount * gift.to.length)
    .reduce((sum, amount) => sum + amount);

  winston.info(`${message.author} is giving cookies.`, { gifts: gifts });
  if (outgoingCookies > sender.cookies) {
    return message.reply(`the Count said you no have enough cookies for ${outgoingCookies} cookies. Remember you have ${sender.cookies.toLocaleString()} cookies!`);
  }

  const given = {};
  gifts.forEach(gift => {
    gift.to.forEach(recipientUser => {
      const recipient = data.getUser(recipientUser);
      given[recipient.user.id] = recipient;

      sender.giveCookiesTo(recipient, gift.amount);
    });
  });

  const givenMessage = Object.keys(given)
    .map(givenId => `${given[givenId].user.username} has ${given[givenId].cookies.toLocaleString()} cookies!`);

  message.channel.send(givenMessage + `, ${sender.user.username} has ${sender.cookies.toLocaleString()} left. Mmmmm!`);
};

function getCookieGrammar(user) {
  if (user.cookies === 1) {
    return 'cookie';
  } else {
    return 'cookies';
  }
}

exports.cookieHelp = function(message) {
  winston.info(`${message.author} asked for help.`);

  const helpMessage = 
`I can do lots of things!!!
\`\`\`
  !cookies - I will count your cookies!
  !cookiesof <@mention> - I count someone else's cookies!
  !bake - I will help you bake COOKIES! The ovens will get too hot if you do it more than once a day though!
  !eatcookie  - I will let you eat one of your wonderful cookies! .... COOKIES!
  :cookie: <@mention> - Give someone cookie!
  :cookie: * <number> <@mention> <@mention>- You can even give lots of cookies!!! To more than one person too!
\`\`\``;
  message.reply(helpMessage);
};
