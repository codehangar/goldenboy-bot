const slackbot = require('node-slackbot');

const botKey = process.env.BOT_KEY;
const bot = new slackbot(botKey);

module.exports = bot;
