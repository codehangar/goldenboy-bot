const simplyTrello = require('simply-trello');
const Trello = require("node-trello");
const trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN);
const trelloKey = process.env.TRELLO_KEY;
const trelloToken = process.env.TRELLO_TOKEN;
const bot = require('./bot');

let meetingNotesMaster = [];

function noteToString(note) {
  let text = note.text;
  if (text.substring(0, 1) == ' ') {
    text = text.substring(1);
  }
  return `- ${text} (added by ${note.user})`;
}

function getMeetingNotes(boardTitle, listTitle, cardTitle) {
  return new Promise((resolve, reject) => {
    trello.get('/1/members/me/boards', (err, data) => {
      if (err) reject(err);
      const board = data.find(board => board.name === boardTitle);
      trello.get('/1/boards/' + board.id + '/lists', (err, data) => {
        if (err) reject(err);
        const list = data.find(list => {
          return list.name === listTitle
        });
        trello.get('/1/lists/' + list.id + '/cards', (err, data) => {
          if (err) reject(err);
          const card = data.find(card => card.name === cardTitle);
          resolve(card);
        });
      });
    });
  });
}

function printMeetingNotes(messageChannel, boardTitle, listTitle, cardTitle) {
  getMeetingNotes(boardTitle, listTitle, cardTitle).then(card => {
    bot.sendMessage(messageChannel, card.desc);
  });
}

function parseMeetingNoteItems(desc, title) {
  const sectionRegex = new RegExp(title + '\n(-){3,}\n(- .*(\n)?)*', 'g');
  const section = desc.match(sectionRegex) || [''];
  return section[0].match(/- .*/g) || [];
}

function addMeetingNote(boardTitle, listTitle, cardTitle, meetingNote) {
  getMeetingNotes(boardTitle, listTitle, cardTitle).then(card => {
    const goodNews = parseMeetingNoteItems(card.desc, 'Good News');
    const empHeadline = parseMeetingNoteItems(card.desc, 'Employee Headlines');
    const custHeadline = parseMeetingNoteItems(card.desc, 'Customer Headlines');

    if (meetingNote.text) {
      if (meetingNote.tag === 'good news:') {
        goodNews.push(noteToString(meetingNote))
      } else if (meetingNote.tag === 'employee headline:') {
        empHeadline.push(noteToString(meetingNote))
      } else if (meetingNote.tag === 'customer headline:') {
        custHeadline.push(noteToString(meetingNote))
      }
    }

    const cardDesc = `
Good News
------------
${goodNews.join('\n')}

Employee Headlines
------------
${empHeadline.join('\n')}

Customer Headlines
------------
${custHeadline.join('\n')}
`;
    console.log(cardDesc);
    updateTrello(meetingNote.channel, listTitle, cardTitle, {cardDesc});
  });
}

function updateMeetingNotes(command, messageText, messageChannel, messageUser) {
  const boardTitle = 'Code Hangar General';
  const cardTitle = 'Meeting Notes';
  const listTitle = getCardListFromCommand(command);
  if (command == 'print meeting notes:') {
    printMeetingNotes(messageChannel, boardTitle, listTitle, cardTitle);
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
    addMeetingNote(boardTitle, listTitle, cardTitle, meetingNote);
  }
  const writeMessage = messageText.split(command)[1];
}

function getCardListFromCommand(command) {
  const listDict = {
    "print meeting notes:": "This Week",
    "save meeting notes:": "This Week",
    "good news:": "This Week",
    "customer headline:": "This Week",
    "employee headline:": "This Week",
    "idea:": "Open",
    "ch todo:": "Open",
    "blog post:": "Blog Article Ideas"
  };
  return listDict[command];
}

function updateTrello(messageChannel, cardList, cardTitle, content) {

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
    content: content
  });
}

module.exports = {
  updateMeetingNotes,
  getCardListFromCommand,
  updateTrello
};
