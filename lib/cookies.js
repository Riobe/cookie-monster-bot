'use strict';

const data = require('./data');

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

exports.giveCookies = function(message, gifts) {
  if (message.mentions.everyone) {
    return message.reply('COOKIES ARE IMPORTANT! DO NOT JUST THROW EVERYWHERE!');
  }

  // No cheating!
  if (message.mentions.users.has(message.author.id)) {
    return message.reply('you already have cookies! Are you trying to cheat?! I SHOULD EAT YOUR COOKIES!!!');
  }

  const sender = data.getUser(message.author);

  const outgoingCookies = gifts
    .map(gift => gift.amount * gift.to.length)
    .reduce((sum, amount) => sum + amount);

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
    .map(givenId => `${given[givenId].user.mention} has ${given[givenId].cookies.toLocaleString()} cookies!`);
  message.channel.send(givenMessage + `, ${sender.user.mention} has ${sender.cookies.toLocaleString()} left. Mmmmm!`);
};

function getCookieGrammar(user) {
  if (user.cookies === 1) {
    return 'cookie';
  } else {
    return 'cookies';
  }
}

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
