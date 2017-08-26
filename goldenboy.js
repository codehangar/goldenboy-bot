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

// console.log('process.env.NODE_ENV', process.env.NODE_ENV); // eslint-disable-line no-console
if (process.env.NODE_ENV === 'development') { // eslint-disable-line no-undef
    require('dotenv').config();
}

const integrations = require('./src/integrations');

let updateMeetingNotes;
let getCardListFromCommand;
let updateTrello;
if (integrations.trello) {
    updateMeetingNotes = require('./src/trello').updateMeetingNotes;
    getCardListFromCommand = require('./src/trello').getCardListFromCommand;
    updateTrello = require('./src/trello').updateTrello;
}

let togglReport;
if (integrations.toggl) {
    togglReport = require('./src/toggl').togglReport;
}

let createGoldenboyIssue;
if (integrations.github) {
    createGoldenboyIssue = require('./src/github').createGoldenboyIssue;
}

let incrementUserSwearCount;
if (integrations.rethinkdb) {
    incrementUserSwearCount = require('./src/rethinkdb_gb').incrementUserSwearCount;
}


const {rtm, web, RTM_EVENTS} = require('./src/bot');
const server = require('./web/server-web');
const {trelloCommands, togglCommands, noteCommands, helpCommands, statusCommands, funCommands, allCommands, swearCommands, githubCommands, mimicCommands} = require('./src/commands');
const {funPrewords, statusPrewords, allPrewords} = require('./src/prewords');
const {updateUsers, getUsernameFromId, updateSwearJar} = require('./src/users');
const {updateChannels, getChannelFromId, updateIMs, getIMfromUID} = require('./src/channels');

// TODO: Replace when mimic file exists
// const {mimicUser} = require('./src/mimic');

const {hates, expressHatred} = require('./src/hates');
const {loves, expressLove} = require('./src/loves');
const {robotName, traits, changeStatus, haveFunPreword, checkSwears} = require('./src/gb-status');
const {swears} = require('./src/swears');


function giveHelp(command, message) {
    switch (command) {
        case 'hello:': {
            rtm.sendMessage('Hello! :)', message.channel);
            break;
        }
        case 'help:': {
            let allCommandsMessage = 'I am Golden Boy! Here are all the things you can tell me to do. \n';
            allCommandsMessage += allCommands.reduce((a, b) => a + '\n' + b);
            const messageLocation = getIMfromUID(message.user);
            console.log('help', messageLocation); // eslint-disable-line no-console
            rtm.sendMessage(allCommandsMessage, messageLocation);
            break;
        }
        default:
            break;
    }
}

function haveFun(command, message) {
    switch (command) {
        case 'kill:': {
            break;
        }
        case 'punish:': {
            const noNoNo = 'I am afraid I cant let you do that, ' + getUsernameFromId(message.user) + '.';
            rtm.sendMessage(noNoNo, message.channel);
            break;
        }
        case 'reward:': {
            const why = 'I have no need for your petty compliments, ' + getUsernameFromId(message.user) + '.';
            rtm.sendMessage(why, message.channel);
            break;
        }
        default:
            break;
    }
}

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    // bot.use(function(message, cb) {
    // console.log(Object.getOwnPropertyNames(message));
    // const multipleCommandFlag = false; // to be implemented
    if (message.type === 'message' && message.text) {
        const messageText = message.text.toLowerCase();
        const userName = getUsernameFromId(message.user);

        console.log(userName + ' said: ' + message.text); // eslint-disable-line no-console

        let swearCount = 0;
        swears.forEach(swear => {
            while (swear.exec(messageText) !== null) {
                swearCount++;
            }
            const usernameSwearCheck = swear.exec(userName);
            if (traits.usernameSwears && usernameSwearCheck) {
                swearCount++;
            }
        });

        if (swearCount) {
            if (integrations.rethinkdb) {
                incrementUserSwearCount(message.user, swearCount).then(() => {
                    rtm.sendMessage('Woah! +' + swearCount + ' to the swear jar for ' + userName + ' :poop: :skull:', message.channel);
                });
            } else {
                updateSwearJar(message.user, swearCount);
                console.log('updating swearz'); // eslint-disable-line no-console
                rtm.sendMessage('Woah! +' + swearCount + ' to the swear jar for ' + userName + ' :poop: :skull:', message.channel);
            }
        }

        if (userName !== robotName) {
            // check for hates
            hates.forEach(hate => {
                if (messageText.indexOf(hate) > -1) {
                    const hateMinusS = (hate.endsWith('s') ? hate.substring(0, hate.length - 1) : hate);
                    const hateMinusApostraphe = (hateMinusS.endsWith('\'') ? hateMinusS.substring(0, hateMinusS.length - 1) : hateMinusS);
                    expressHatred(hateMinusApostraphe, message);
                }
            });

            // check for loves
            loves.forEach(love => {
                if (messageText.indexOf(love) > -1) {
                    const loveMinusS = (love.endsWith('s') ? love.substring(0, love.length - 1) : love);
                    const loveMinusApostrophe = (loveMinusS.endsWith('\'') ? loveMinusS.substring(0, loveMinusS.length - 1) : loveMinusS);
                    expressLove(loveMinusApostrophe, message);
                }
            });


            if (message.text.indexOf(robotName) > -1 || ~message.text.indexOf('<@U42RZ5QNM>')) { // check for golden boy mention
                console.log('found goldenboy mention'); // eslint-disable-line no-console
                allPrewords.forEach(preword => {
                    const prewordCombo = preword + ' ' + robotName;
                    const prewordAtCombo = preword + ' ' + '<@U42RZ5QNM>';
                    if (~messageText.indexOf(prewordCombo) || ~messageText.indexOf(prewordAtCombo)) {
                        console.log('found preword'); // eslint-disable-line no-console
                        if (~funPrewords.indexOf(preword) && traits.goldenBoyStatus === 'speak') {
                            haveFunPreword(preword, message);
                        }
                        if (~statusPrewords.indexOf(preword)) { // eslint-disable-line no-console
                            console.log('changing status with preword ' + preword); // eslint-disable-line no-console
                            changeStatus(preword, message);
                        }
                    }
                });
            }


            if (message.text.indexOf(':') > -1) {  // check for commands
                console.log('found colon'); // eslint-disable-line no-console
                allCommands.forEach(command => {
                    if (messageText.indexOf(command) > -1) {
                        console.log('found command ' + command); // eslint-disable-line no-console
<<<<<<< HEAD
                        if (mimicCommands.indexOf(command) > -1){
                            console.log('executing mimic command'); // eslint-disable-line no-console
                            mimicUser(message.channel, message.text);
                        }
                        if (integrationsValid.trello && ~trelloCommands.indexOf(command) && traits.goldenBoyStatus !== 'sleep') {
=======
                        if (mimicCommands.indexOf(command) > -1) {
                            console.log('executing mimic command'); // eslint-disable-line no-console
                            // TODO: Replace when mimic file exists
                            // mimicUser(message.channel, message.text);
                        }
                        if (integrations.trello && ~trelloCommands.indexOf(command) && traits.goldenBoyStatus !== 'sleep') {
>>>>>>> c2fff718f7fdc33fade583475a8ca4b7c7134b1c
                            console.log('executing trello command'); // eslint-disable-line no-console
                            const cardTitle = message.text.split(command)[1];
                            const cardComment = 'Automatically Generated by goldenboy\n' + 'User: ' + userName + '\nChannel: #' + getChannelFromId(message.channel);
                            const cardList = getCardListFromCommand(command);
                            updateTrello(message.channel, cardList, cardTitle, {cardComment});
                        }
                        if (integrations.toggl && togglCommands.indexOf(command) > -1 && traits.goldenBoyStatus !== 'sleep') {
                            console.log('executing toggl command'); // eslint-disable-line no-console
                            togglReport(message.text, message.channel);
                        }
                        if (integrations.trello && noteCommands.indexOf(command) > -1 && traits.goldenBoyStatus !== 'sleep') {
                            console.log('executing meeting note command'); // eslint-disable-line no-console
                            updateMeetingNotes(command, message.text, message.channel, userName);
                        }
                        if (integrations.github && githubCommands.indexOf(command) > -1) {
                            console.log('executing github command'); // eslint-disable-line no-console
                            createGoldenboyIssue(message);
                        }
                        if (helpCommands.indexOf(command) > -1 && traits.goldenBoyStatus !== 'sleep') {
                            console.log('executing help command'); // eslint-disable-line no-console
                            giveHelp(command, message);
                        }
                        if (funCommands.indexOf(command) > -1 && traits.goldenBoyStatus === 'speak') {
                            console.log('executing fun command'); // eslint-disable-line no-console
                            haveFun(command, message);
                        }
                        if (statusCommands.indexOf(command) > -1) {
                            console.log('executing status command'); // eslint-disable-line no-console
                            changeStatus(command, message);
                        }
                        if (swearCommands.indexOf(command) > -1) {
                            console.log('executing swear command'); // eslint-disable-line no-console
                            checkSwears(command, message);
                        }
                    }
                });
            }
        }
    }
});

web.users.list((err, data) => {
    if (err) {
        console.error('web.users.list Error:', err); // eslint-disable-line no-console
    } else {
        updateUsers(data);
    }
});

web.channels.list((err, data) => {
    if (err) {
        console.error('web.channels.list Error:', err); // eslint-disable-line no-console
    } else {
        // console.log(data)
        updateChannels(data);
    }
});

web.im.list((err, data) => {
    if (err) {
        console.error('web.im.list Error:', err); // eslint-disable-line no-console
    } else {
        updateChannels(updateIMs(data));
    }
});

traits.startTime = new Date().getTime() / 1000;

rtm.start();
