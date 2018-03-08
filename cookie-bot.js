'use strict';

const Discord = require('discord.js');
const cookies = require('./lib/cookies');
const winston = require('winston');

winston.configure({
  level: 'silly',
  transports: [
    new winston.transports.Console({
      colorize: true,
      timestamp: true,
      level: 'silly'
    }),
    new winston.transports.File({
      name: 'log-file',
      filename: 'logs/cookie-bot.log',
      level: 'debug',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: false,
      prettyPrint: true,
      tailable: true,
      maxFiles: 10,
      maxsize: 500000
    })
  ]
});

// 2 capture groups:
// match[1]: The command itself.
// match[2]: The rest of the string after the command and any whitespace following it.
const COMMAND_REGEX = /^\s*!(\w+)\s*(.*)/;

// 3 capture groups:
// match[1]: A potential negative sign if the user was trying to steal cookies.
// match[2]: The number of cookies, if specified. Assume 1 if not.
// match[3]: The mentions to give these cookies to.
// match[4]: The last ID, ignore this groupr
const GIFT_REGEX = /🍪\s*(?:[*xX]\s*(\-?)(\d+))?((?:\s*<@!?(\d+)>)+)[^🍪]*/g;

// 1 capture group:
// match[1]: The ID of the user mentioned.
const MENTION_REGEX = /<@!?(\w+)>/g;
const client = new Discord.Client();

const token = process.env.BOT_TOKEN;
client.login(token);

client.on('ready', () => {
  winston.info('Client is running.');
});

client.on('error', err => {
  winston.error(err);
});

client.on('message', message => {
  const content = message.content.trim();

  let match;
  if (match = COMMAND_REGEX.exec(content)) {
    const command = match[1];
    winston.info(`"!${command}" for (${message.author.id}|${message.author.username})`);
    switch (command) {
      case 'bake':
        cookies.bakeCookies(message);
        return;
      case 'cookiesof':
        cookies.listCookies(message);
        return;
      case 'cookie':
      case 'cookies':
        cookies.listOwnCookies(message);
        return;
      case 'cookiehelp':
      case 'cookieshelp':
        cookies.cookieHelp(message);
        return;
      case 'test':
        message.reply('🍪* 2 <@!129631547077689344> <@270804633000083456>');
        return;
    }
  }

  const gifts = [];
  while (match = GIFT_REGEX.exec(content)) {
    const mentions = [];
    let mentionMatch;
    while (mentionMatch = MENTION_REGEX.exec(match[3])) {
      // Need both ID and user name to make a user.
      const mention = message.mentions.users.get(mentionMatch[1]);
      mentions.push({
        id: mention.id,
        username: mention.username
      });
    }

    gifts.push({
      // If negative, give 1 cookies, otherwise use the number given if present, otherwise 1.
      amount: match[1] ? 1 : Number(match[2]) || 1,
      to: mentions
    });
  }

  if (gifts.length) {
    winston.info('Giving cookie gifts.', { gifts: gifts});
    return cookies.giveCookies(message, gifts);
  }
});
