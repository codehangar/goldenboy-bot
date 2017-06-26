const RtmClient = require('@slack/client').RtmClient;
const WebClient = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const botToken = process.env.BOT_KEY || ''; // eslint-disable-line no-undef

const rtm = new RtmClient(botToken);
const web = new WebClient(botToken);

module.exports = {rtm, web, RTM_EVENTS};
