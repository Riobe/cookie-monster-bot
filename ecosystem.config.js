'use strict';

module.exports = {
  apps: [{
    name: 'cookie-bot',
    script: './cookie-bot.js',
    watch: true,
    env: {
      NODE_ENV: 'development',
      DEBUG: 'cookie-bot:*',
      BOT_TOKEN: process.env.BOT_TOKEN
    },
    env_production: {
      NODE_ENV: 'production',
      BOT_TOKEN: process.env.BOT_TOKEN
    }
  }]
};
