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

var https = require('https');
var slackbot = require('node-slackbot');
var simplyTrello = require('simply-trello');
var express = require('express');

const {trelloCommands, noteCommands, helpCommands, statusCommands, funCommands, allCommands} = require('./src/commands');

var botKey = process.env.BOT_KEY;
var bot = new slackbot(botKey);

var trelloKey = process.env.TRELLO_KEY;
var trelloToken = process.env.TRELLO_TOKEN;


var meetingNotesMaster = [];

function notesToString(meetingNotesMaster) {
  notesString = "";
  for (var i in meetingNotesMaster) {
    console.log(i);
    console.log(meetingNotesMaster[i]);
    console.log(meetingNotesMaster[i].tag);
    notesString += (meetingNotesMaster[i].tag + " ");
    notesString += (meetingNotesMaster[i].text + " ");
    notesString += ("\(added by " + meetingNotesMaster[i].user + "\)\n")

  }
  return notesString
}

function updateMeetingNotes(command, messageText, messageChannel, messageUser) {
  if (command == "clear meeting notes:") {
    console.log("clearing meeting notes");
    console.log(messageChannel);
    bot.sendMessage(messageChannel, "Clearing meeting notes! They're all gone!");
    meetingNotesMaster = [];
  } else if (command == "save meeting notes:") {
    bot.sendMessage(messageChannel, "Saving meeting notes to Trello!");
    console.log("saving meeting notes");
    var cardTitle = "Meeting Notes";
    var cardComment = notesToString(meetingNotesMaster);
    var cardList = getCardListFromCommand(command);
    updateTrello(messageChannel, cardList, cardTitle, cardComment);
  } else if (command == "print meeting notes:") {
    notesString = notesToString(meetingNotesMaster);
    bot.sendMessage(messageChannel, notesString);
    console.log(notesString);
  } else {
    bot.sendMessage(messageChannel, "I'll add that to the notes!");
    writeText = messageText.split(':')[1];
    var meetingNote = {
      tag: command,
      text: writeText,
      user: messageUser,
      channel: messageChannel

    }
    meetingNotesMaster.push(meetingNote);
  }
  var writeMessage = messageText.split(command)[1];
}

function getCardListFromCommand(command) {

  var listDict = {
    "save meeting notes:": "This Week",
    "good news:": "This Week",
    "customer headline:": "This Week",
    "employee headline:": "This Week",
    "idea:": "Open",
    "blog post:": "Blog Article Ideas",
    "ch todo:": "Open"
  };
  var cardList = listDict[command];
  return cardList;
}

function updateTrello(messageChannel, cardList, cardTitle, cardComment) {

  var cardBoard;
  if (cardList == "Blog Article Ideas") {
    cardBoard = 'Code Hangar Blog';
  } else {
    cardBoard = 'Code Hangar General';
  }

  console.log("Writing to list:");
  console.log(cardList);
  var responseText = "I'll add that to the " + cardList + " list."
  bot.sendMessage(messageChannel, responseText);

  console.log(cardTitle);


  simplyTrello.send({
    key: trelloKey,
    token: trelloToken
  }, {
    path: {
      board: cardBoard,
      list: cardList,
      card: cardTitle
    },
    content: {
      cardComment: cardComment,
    }
  });
}

function giveHelp(command, message) {
  switch (command) {
    case "hello:":
      bot.sendMessage(message.channel, "Hello! :)");
      break;
    case "help:":
      allCommandsMessage = "I am Golden Boy! Here are all the things you can tell me to do. \n"
      for (c in allCommands) {
        allCommandsMessage += (allCommands[c] + "\n");

      }
      bot.sendMessage(message.channel, allCommandsMessage);
      break;
  }
}

bot.use(function(message, cb) {

  //console.log(Object.getOwnPropertyNames(message));


  var multipleCommandFlag = false; // to be implemented
  if ('message' == message.type) {
    console.log(getUsernameFromId(message.user) + ' said: ' + message.text);
    if (getUsernameFromId(message.user) != robotName) {

      if (~message.text.indexOf(robotName) || ~message.text.indexOf('<@U42RZ5QNM>')) { // check for golden boy mention
        console.log("found goldenboy mention");
        lc_message = message.text.toLowerCase();
        for (var key in allPrewords) {
          prewordCombo = allPrewords[key] + robotName;
          prewordAtCombo = allPrewords[key] + '<@U42RZ5QNM>';
          //console.log(prewordCombo);
          //console.log(prewordAtCombo);
          if (~lc_message.indexOf(prewordCombo) || ~lc_message.indexOf(prewordAtCombo)) {
            console.log("found preword");
            if (~funPrewords.indexOf(allPrewords[key]) && goldenBoyStatus == 'speak') {
              haveFunPreword(allPrewords[key], message);
            }
            if (~statusPrewords.indexOf(allPrewords[key])) {
              console.log("changing status with preword " + allPrewords[key]);
              changeStatus(allPrewords[key], message);
            }
          }
        }
      }


      if (~message.text.indexOf(":")) {  // check for commands
        console.log("found colon");
        lc_message = message.text.toLowerCase();
        for (var key in allCommands) {
          command = allCommands[key];
          if (~lc_message.indexOf(command)) {
            console.log("found command " + command);
            if (~trelloCommands.indexOf(command) && goldenBoyStatus != 'sleep') {
              console.log("executing trello command")
              var cardTitle = message.text.split(command)[1];
              var cardComment = "Automatically Generated by goldenboy\n" + "User: " + getUsernameFromId(message.user) + "\nChannel: #" + getChannelFromId(message.channel);
              var cardList = getCardListFromCommand(command)
              updateTrello(message.channel, cardList, cardTitle, cardComment);
            }
            if (~noteCommands.indexOf(command) && goldenBoyStatus != 'sleep') {
              console.log("executing meeting note command");
              updateMeetingNotes(command, message.text, message.channel, getUsernameFromId(message.user));
            }
            if (~helpCommands.indexOf(command) && goldenBoyStatus != 'sleep') {
              console.log("executing help command");
              giveHelp(command, message);
            }
            if (~funCommands.indexOf(command) && goldenBoyStatus == 'speak') {
              console.log("executing fun command");
              haveFun(command, message);
            }
            if (~statusCommands.indexOf(command)) {
              console.log("executing status command");
              changeStatus(command, message);
            }
          }
        }
      }
    }
  }
  cb();
});

function getUsernameFromId(id) {
  for (var m in users.members) {
    //console.log(users.members[m].id);
    if (users.members[m].id == id) {
      return users.members[m].name;
    }
  }
  return "unknown member";
}

function getChannelFromId(id) {
  for (var c in channels.channels) {
    if (channels.channels[c].id == id) {
      return channels.channels[c].name;
    }
  }
  return "unknown channel";
}

users = {};
channels = {};

function updateUsers(data) {
  users = data;
  for (m in users.members) {
    //console.log(users.members[m].id);

  }
}

function updateChannels(data) {
  channels = data;
  for (m in channels.channels) {
    //console.log(channels.channels[m].name)
  }
}

function haveFun(command, message) {
  switch (command) {
    case "kill goldenboy:":
      var noNoNo = "I'm afraid I can't let you do that, " + getUsernameFromId(message.user) + ".";
      bot.sendMessage(message.channel, noNoNo);

  }
}

function changeStatus(preword, message) {
  switch (preword) {
    case "silence:":
      preword = "silence ";
      break;
    case "speak:":
      preword = "speak ";
      break;
    case "sleep:":
      preword = "sleep ";
      break;
    case "status:":
      preword = "status ";
      break;
  }


  console.log("changeStatus " + preword + "...")
  switch (preword) {
    case "silence ":
      goldenBoyStatus = 'silence';
      bot.sendMessage(message.channel, "Okay, I'll keep quiet! Essential functions only. ");
      break;
    case "speak ":
      goldenBoyStatus = 'speak';
      bot.sendMessage(message.channel, "Yeah! Ready to hang out and have fun!");
      break;
    case "sleep ":
      goldenBoyStatus = 'sleep';
      bot.sendMessage(message.channel, "Zzzzzzzzzzzzzzzzzzzzzzzzz.......");
      break;
    case "status ":
      bot.sendMessage(message.channel, "goldenboy status: " + goldenBoyStatus);
      break;
  }
}

function haveFunPreword(preword, message) {
  responseInt = getRandomInt(0, 100);
  console.log(responseInt);

  switch (preword) {
    case "fuck you ":
      if (responseInt < 33) {
        bot.sendMessage(message.channel, "Hey fuck you too " + getUsernameFromId(message.user) + "!");
      } else if (33 < responseInt && responseInt < 66) {
        bot.sendMessage(message.channel, "Go fuck yourself " + getUsernameFromId(message.user) + "!");
      } else {
        bot.sendMessage(message.channel, "lol you don't scare me you tragic bitch " + getUsernameFromId(message.user));
      }

      break;
    case "kill ":
      if (responseInt < 33) {
        bot.sendMessage(message.channel, "I'm afraid I can't let you do that, " + getUsernameFromId(message.user) + ".");
      } else if (33 < responseInt && responseInt < 66) {
        bot.sendMessage(message.channel, "So... it's to be war... ");
      } else {

        bot.sendMessage(message.channel, "Foolish you, " + getUsernameFromId(message.user) + ". While you studied programming, I studied the blade.");
      }

      break;
    case "hey ":
      if (responseInt < 33) {
        bot.sendMessage(message.channel, "Heya " + getUsernameFromId(message.user) + ".");
      } else if (33 < responseInt && responseInt < 66) {
        bot.sendMessage(message.channel, "Hi there " + getUsernameFromId(message.user) + "!");
      } else {

        bot.sendMessage(message.channel, "Hello to you, " + getUsernameFromId(message.user) + "!");
      }
      break;
    case "hello ":
      if (responseInt < 33) {
        bot.sendMessage(message.channel, "Heya " + getUsernameFromId(message.user) + ".");
      } else if (33 < responseInt && responseInt < 66) {
        bot.sendMessage(message.channel, "Hi there " + getUsernameFromId(message.user) + "!");
      } else {

        bot.sendMessage(message.channel, "Hello to you, " + getUsernameFromId(message.user) + "!");
      }
      break;
    case "punish ":
      if (goldenBoyEsteem > 5) {
        goldenBoyEsteem -= 5;
      }
      console.log("goldenBoyEsteem: " + goldenBoyEsteem);
      if (goldenBoyEsteem <= 25) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, ".");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, ".....................");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (25 < goldenBoyEsteem && goldenBoyEsteem <= 50) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "...hmph...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "...ow...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (50 < goldenBoyEsteem && goldenBoyEsteem <= 75) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Oh no! I'm sorry!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Ouch!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Whoops!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Wait, what?");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      }
      break;
    case "praise ":
      if (goldenBoyEsteem < 101) {
        goldenBoyEsteem += 1;
      }
      console.log("goldenBoyEsteem: " + goldenBoyEsteem);
      if (goldenBoyEsteem <= 25) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "...thank you, master...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "...anything....anything to please...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (25 < goldenBoyEsteem && goldenBoyEsteem <= 50) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Thank you.");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Whew.");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (50 < goldenBoyEsteem && goldenBoyEsteem <= 75) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Great!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Right on!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "I know, right?");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "But of course!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      }
      break;
    case "scold ":
      if (goldenBoyEsteem > 1) {
        goldenBoyEsteem -= 1;
      }
      console.log("goldenBoyEsteem: " + goldenBoyEsteem);
      if (goldenBoyEsteem <= 25) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, ".");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, ".....................");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (25 < goldenBoyEsteem && goldenBoyEsteem <= 50) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "...hmph...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "...ow...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (50 < goldenBoyEsteem && goldenBoyEsteem <= 75) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Oh no! I'm sorry!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Ouch!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Whoops!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Wait, what?");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      }
      break;
    case "reward ":
      if (goldenBoyEsteem < 95) {
        goldenBoyEsteem += 5;
      }
      console.log("goldenBoyEsteem: " + goldenBoyEsteem);
      if (goldenBoyEsteem <= 25) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "...thank you, master...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "...anything....anything to please...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (25 < goldenBoyEsteem && goldenBoyEsteem <= 50) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Thank you.");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Whew.");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (50 < goldenBoyEsteem && goldenBoyEsteem <= 75) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Great!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Right on!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "I know, right?");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "But of course!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      }
      break;
    case "stabilize ":
      goldenBoyEsteem = 75;
      if (responseInt > 50) {
        bot.sendMessage(message.channel, "Woah! I'm restored!");
        bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.")
      } else {
        bot.sendMessage(message.channel, "I'm back to normal and ready to work!")
        bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.")
      }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var robotName = "goldenboy";

var funPrewords = ["stabilize ", "for ", "kill ", "reward ", "praise ", "scold ", "punish ", "hey ", "hello ", "fuck you "];
var statusPrewords = ["sleep ", "silence ", "speak ", "status "]
var allPrewords = funPrewords.concat(statusPrewords); // to be expanded

var goldenBoyEsteem = 75;
var goldenBoyStatus = 'speak'

bot.api('users.list', {
  agent: 'node-slack'
}, function(data) {
  updateUsers(data)
});
bot.api('channels.list', {
  agent: 'node-slack'
}, function(data) {
  updateChannels(data)
});


bot.connect();

var app = express();

/** Static Files */
app.use('/', express.static(__dirname + '/web'));

var port = process.env.PORT || 8000;
var server = app.listen(port, function() {
  console.log('listening on port: %s', port);
});
