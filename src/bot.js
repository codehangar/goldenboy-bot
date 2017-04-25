const RtmClient = require('@slack/client').RtmClient;
const WebClient = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const bot_token = process.env.BOT_KEY || '';

const rtm = new RtmClient(bot_token);
const web = new WebClient(bot_token);

module.exports = {rtm, web, RTM_EVENTS};
