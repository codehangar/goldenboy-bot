const simplyTrello = require('simply-trello');
const trelloKey = process.env.TRELLO_KEY;
const trelloToken = process.env.TRELLO_TOKEN;
const bot = require('./bot');

let meetingNotesMaster = [];

function notesToString(meetingNotesMaster) {
  let notesString = "";
  for (const i in meetingNotesMaster) {
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
    const cardTitle = "Meeting Notes";
    const cardComment = notesToString(meetingNotesMaster);
    const cardList = getCardListFromCommand(command);
    updateTrello(messageChannel, cardList, cardTitle, cardComment);
  } else if (command == "print meeting notes:") {
    const notesString = notesToString(meetingNotesMaster);
    bot.sendMessage(messageChannel, notesString);
    console.log(notesString);
  } else {
    bot.sendMessage(messageChannel, "I'll add that to the notes!");
    const writeText = messageText.split(':')[1];
    const meetingNote = {
      tag: command,
      text: writeText,
      user: messageUser,
      channel: messageChannel
    };
    meetingNotesMaster.push(meetingNote);
  }
  const writeMessage = messageText.split(command)[1];
}

function getCardListFromCommand(command) {
  const listDict = {
    "save meeting notes:": "This Week",
    "good news:": "This Week",
    "customer headline:": "This Week",
    "employee headline:": "This Week",
    "idea:": "Open",
    "blog post:": "Blog Article Ideas",
    "ch todo:": "Open"
  };
  const cardList = listDict[command];
  return cardList;
}

function updateTrello(messageChannel, cardList, cardTitle, cardComment) {

  let cardBoard;
  if (cardList == "Blog Article Ideas") {
    cardBoard = 'Code Hangar Blog';
  } else {
    cardBoard = 'Code Hangar General';
  }

  console.log("Writing to list:");
  console.log(cardList);
  const responseText = `I'll add that to the ${cardTitle} card in the ${cardList} list.`;
  bot.sendMessage(messageChannel, responseText);

  console.log(responseText);


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

module.exports = {
  updateMeetingNotes: updateMeetingNotes,
  getCardListFromCommand: getCardListFromCommand,
  updateTrello: updateTrello
};
