// Ideas:
// Punish/Reward
// Harass User
// Kill
// random interjections
// dms/secrets
// worthless trivia
// likes: gold, cookies, full communism, chicken dinners, approval, la croix, gifs, politeness(needs please randomly)
// dislikes: microsoft, nazis, aaron blankenship, boredom, loneliness, brb, weird
// swear jar
// vote
// respond to name mention
// sleep, silence, awake

console.log('process.env.NODE_ENV', process.env.NODE_ENV); // eslint-disable-line no-console
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const bot = require('./src/bot');
const server = require('./web/server-web');
const {trelloCommands, togglCommands, noteCommands, helpCommands, statusCommands, funCommands, allCommands} = require('./src/commands');
const {funPrewords, statusPrewords, allPrewords} = require('./src/prewords');
const {updateUsers, getUsernameFromId} = require('./src/users');
const {updateChannels, getChannelFromId} = require('./src/channels');
const {updateMeetingNotes, getCardListFromCommand, updateTrello} = require('./src/trello');
const {togglReport} = require('./src/toggl');
const {robotName, traits, changeStatus, haveFunPreword} = require('./src/gb-status');


function giveHelp(command, message) {
  switch (command) {
    case "hello:":
      bot.sendMessage(message.channel, "Hello! :)");
      break;
    case "help:":
      let allCommandsMessage = "I am Golden Boy! Here are all the things you can tell me to do. \n";
      allCommandsMessage += allCommands.reduce((a, b) => a + '\n' + b);
      bot.sendMessage(message.channel, allCommandsMessage);
      break;
  }
}

bot.use(function(message, cb) {

  //console.log(Object.getOwnPropertyNames(message));


  const multipleCommandFlag = false; // to be implemented
  if (message.type === 'message') {
    const lc_message = message.text.toLowerCase();
    const userName = getUsernameFromId(message.user);

    console.log(userName + ' said: ' + message.text);
    if (userName !== robotName) {

      if (~message.text.indexOf(robotName) || ~message.text.indexOf('<@U42RZ5QNM>')) { // check for golden boy mention
        console.log("found goldenboy mention");
        allPrewords.forEach(function(preword) {
          const prewordCombo = preword + ' ' + robotName;
          const prewordAtCombo = preword + ' ' + '<@U42RZ5QNM>';
          if (~lc_message.indexOf(prewordCombo) || ~lc_message.indexOf(prewordAtCombo)) {
            console.log("found preword");
            if (~funPrewords.indexOf(preword) && traits.goldenBoyStatus == 'speak') {
              haveFunPreword(preword, message);
            }
            if (~statusPrewords.indexOf(preword)) {
              console.log("changing status with preword " + preword);
              changeStatus(preword, message);
            }
          }
        });
      }


      if (~message.text.indexOf(":")) {  // check for commands
        console.log("found colon");
        allCommands.forEach(function(command) {
          if (~lc_message.indexOf(command)) {
            console.log("found command " + command);
            if (~trelloCommands.indexOf(command) && traits.goldenBoyStatus != 'sleep') {
              console.log("executing trello command");
              const cardTitle = message.text.split(command)[1];
              const cardComment = "Automatically Generated by goldenboy\n" + "User: " + userName + "\nChannel: #" + getChannelFromId(message.channel);
              const cardList = getCardListFromCommand(command);
              updateTrello(message.channel, cardList, cardTitle, cardComment);
            }
            if (~togglCommands.indexOf(command) && traits.goldenBoyStatus != 'sleep') {
              console.log("executing toggl command");
              togglReport(message.text, message.channel);
            }
            if (~noteCommands.indexOf(command) && traits.goldenBoyStatus != 'sleep') {
              console.log("executing meeting note command");
              updateMeetingNotes(command, message.text, message.channel, userName);
            }
            if (~helpCommands.indexOf(command) && traits.goldenBoyStatus != 'sleep') {
              console.log("executing help command");
              giveHelp(command, message);
            }
            if (~funCommands.indexOf(command) && traits.goldenBoyStatus == 'speak') {
              console.log("executing fun command");
              haveFun(command, message);
            }
            if (~statusCommands.indexOf(command)) {
              console.log("executing status command");
              changeStatus(command, message);
            }
          }
        });
      }
    }
  }
  cb();
});

function haveFun(command, message) {
  switch (command) {
    case "kill:":
    case "punish:":
      const noNoNo = "I'm afraid I can't let you do that, " + getUsernameFromId(message.user) + ".";
      bot.sendMessage(message.channel, noNoNo);
      break;
    case "reward:":
      const why = "I have no need for your petty compliments, " + getUsernameFromId(message.user) + ".";
      bot.sendMessage(message.channel, why);
      break;
  }
}


bot.api('users.list', {agent: 'node-slack'}, updateUsers);
bot.api('channels.list', {agent: 'node-slack'}, updateChannels);
bot.connect();
