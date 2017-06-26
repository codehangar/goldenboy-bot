const simplyTrello = require('simply-trello');
const Trello = require('node-trello');
const trelloKey = process.env.TRELLO_KEY; // eslint-disable-line no-undef
const trelloToken = process.env.TRELLO_TOKEN; // eslint-disable-line no-undef
const trello = new Trello(trelloKey, trelloToken);
const {rtm} = require('./bot');

const meetingNotesMaster = [];

function noteToString(note) {
    let text = note.text;
    if (text.substring(0, 1) === ' ') {
        text = text.substring(1);
    }
    return `- ${text} (added by ${note.user})`;
}

function getMeetingNotes(boardTitle, listTitle, cardTitle) {
    return new Promise((resolve, reject) => {
        trello.get('/1/members/me/boards', (err1, boards) => {
            if (err1) reject(err1);

            const board = boards.find(b => b.name === boardTitle);
            trello.get('/1/boards/' + board.id + '/lists', (err2, lists) => {
                if (err2) reject(err2);

                const list = lists.find(l => l.name === listTitle);
                trello.get('/1/lists/' + list.id + '/cards', (err3, cards) => {
                    if (err3) reject(err3);

                    const card = cards.find(c => c.name === cardTitle);
                    resolve(card);
                });
            });
        });
    });
}

function printMeetingNotes(messageChannel, boardTitle, listTitle, cardTitle) {
    getMeetingNotes(boardTitle, listTitle, cardTitle).then(card => {
        rtm.sendMessage(card.desc, messageChannel);
    });
}

function parseMeetingNoteItems(desc, title) {
    const sectionRegex = new RegExp(title + '\n(-){3,}\n(- .*(\n)?)*', 'g');
    const section = desc.match(sectionRegex) || [''];
    return section[0].match(/- .*/g) || [];
}

function updateTrello(messageChannel, cardList, cardTitle, content) {
    let cardBoard;
    if (cardList === 'Blog Article Ideas') {
        cardBoard = 'Code Hangar Blog';
    } else {
        cardBoard = 'Code Hangar General';
    }

    const responseText = `I'll add that to the ${cardTitle} card in the ${cardList} list.`;
    rtm.sendMessage(responseText, messageChannel);

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

function addMeetingNote(boardTitle, listTitle, cardTitle, meetingNote) {
    getMeetingNotes(boardTitle, listTitle, cardTitle).then(card => {
        const goodNews = parseMeetingNoteItems(card.desc, 'Good News');
        const empHeadline = parseMeetingNoteItems(card.desc, 'Employee Headlines');
        const custHeadline = parseMeetingNoteItems(card.desc, 'Customer Headlines');

        if (meetingNote.text) {
            if (meetingNote.tag === 'good news:') {
                goodNews.push(noteToString(meetingNote));
            } else if (meetingNote.tag === 'employee headline:') {
                empHeadline.push(noteToString(meetingNote));
            } else if (meetingNote.tag === 'customer headline:') {
                custHeadline.push(noteToString(meetingNote));
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
        updateTrello(meetingNote.channel, listTitle, cardTitle, {cardDesc});
    });
}

function getCardListFromCommand(command) {
    const listDict = {
        'print meeting notes:': 'This Week',
        'save meeting notes:': 'This Week',
        'good news:': 'This Week',
        'customer headline:': 'This Week',
        'employee headline:': 'This Week',
        'idea:': 'Open',
        'ch todo:': 'Open',
        'blog post:': 'Blog Article Ideas'
    };
    return listDict[command];
}

function updateMeetingNotes(command, messageText, messageChannel, messageUser) {
    const boardTitle = 'Code Hangar General';
    const cardTitle = 'Meeting Notes';
    const listTitle = getCardListFromCommand(command);
    if (command === 'print meeting notes:') {
        printMeetingNotes(messageChannel, boardTitle, listTitle, cardTitle);
    } else {
        rtm.sendMessage('I\'ll add that to the notes!', messageChannel);
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
    // const writeMessage = messageText.split(command)[1];
}
module.exports = {
    updateMeetingNotes,
    getCardListFromCommand,
    updateTrello
};
