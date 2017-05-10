
var RtmClient = require('@slack/client').RtmClient;
var WebClient = require('@slack/client').WebClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var bot_token = process.env.BOT_KEY || '';

var rtm = new RtmClient(bot_token);
var web = new WebClient(bot_token);

module.exports = {rtm, web, RTM_EVENTS};
