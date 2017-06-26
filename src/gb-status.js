const {rtm} = require('./bot');
const {listUsers, getUsernameFromId, getSwearJar} = require('./users');
const {funResponses, statusResponses} = require('./prewords');
const integrations = require('./integrations');
console.log('integrations', integrations); // eslint-disable-line no-console
let getUserSwearCount;
if (integrations.rethinkdb) {
    getUserSwearCount = require('./rethinkdb_gb').getUserSwearCount;
}
const robotName = 'goldenboy';
const traits = {
    goldenBoyEsteem: 75,
    goldenBoyStatus: 'speak',
    startTime: 0,
    usernameSwears: false
};

function getRandomInt(min, max) {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt)) + minInt;
}

function formatUptime(seconds) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }

    const hours = Math.floor(seconds / (60 * 60));
    const minutes = Math.floor(seconds % (60 * 60) / 60);
    const secondsRemainder = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(secondsRemainder);
}

function checkSwears(command, message) {
    const mText = message.text.split(':')[1];
    if (mText) {
        const user = listUsers().find(u => mText.indexOf(u.name) > -1);
        if (user) {
            if (integrations.rethinkdb) {
                getUserSwearCount(user.id).then((swearCount) => {
                    rtm.sendMessage(`${user.name} has sworn ${swearCount} times! Yikes!`, message.channel);
                });
            }
        } else if (mText === 'usernameSwears') {
            traits.usernameSwears = !traits.usernameSwears;
            rtm.sendMessage('Username swearjar checking ' + (traits.usernameSwears ? 'on' : 'off'), message.channel);
        } else {
            rtm.sendMessage('I can\'t find any user in that message!', message.channel);
        }
    } else {
        if (integrations.rethinkdb) {
            getSwearJar().then((swearJar) => {
                let returnString = '```\nThese people are just rude...\n-----------------------------';
                returnString += swearJar.reduce((agg, entry) => {
                    return agg + '\n' + entry;
                }, '');
                returnString += '\n```';
                rtm.sendMessage(returnString, message.channel);
            });
        } else {
            const swearJar = getSwearJar();
            let returnString = '```\nThese people are just rude...\n-----------------------------\n';
            for (const swearUser in swearJar) {
                if (swearJar[swearUser] > 0) {
                    returnString += swearUser + ': ' + swearJar[swearUser] + ' swears\n';
                }
            }
            returnString += '\n```';
            rtm.sendMessage(returnString, message.channel);
        }
    }
}

function changeStatus(preword, message) {
    const status = preword.replace(/:/, '');
    const response = statusResponses[status].replace(/\{status}/, traits.goldenBoyStatus).replace(/\{uptime}/, formatUptime((new Date().getTime() / 1000) - traits.startTime));
    switch (status) {
        case 'silence':
            traits.goldenBoyStatus = 'silence';
            break;
        case 'speak':
            traits.goldenBoyStatus = 'speak';
            break;
        case 'sleep':
            traits.goldenBoyStatus = 'sleep';
            break;
        default:
            console.log('Unknown Goldenboy Status: ', status); // eslint-disable-line no-console
    }
    console.log('changeStatus', status); // eslint-disable-line no-console
    rtm.sendMessage(response, message.channel);
}

function getEsteemLevel() {
    if (traits.goldenBoyEsteem <= 25) {
        return 0;
    } else if (traits.goldenBoyEsteem <= 50) {
        return 1;
    } else if (traits.goldenBoyEsteem <= 75) {
        return 2;
    }
    return 3;
}

function getRandomFunResponse(preword, userName, esteemLevel) {
    const resArray = funResponses[preword];
    if (resArray && resArray.length > 0) {
        if (typeof resArray[0] === 'string') {
            return resArray[getRandomInt(0, resArray.length)].replace(/\{user}/, userName);
        } else if (resArray[esteemLevel] && typeof resArray[esteemLevel] === 'object' && resArray[esteemLevel].length > 0) {
            return resArray[esteemLevel][getRandomInt(0, resArray[esteemLevel].length)].replace(/\{user}/, userName);
        }
    }
    return 'I have no idea what you\'re talking about...';
}

function haveFunPreword(preword, message) {
    const userName = getUsernameFromId(message.user);
    const esteemLevel = getEsteemLevel();
    const response = getRandomFunResponse(preword, userName, esteemLevel);

    switch (preword) {
        case 'punish':
            if (traits.goldenBoyEsteem > 5) traits.goldenBoyEsteem -= 5;
            break;
        case 'praise':
            if (traits.goldenBoyEsteem < 101) traits.goldenBoyEsteem += 1;
            break;
        case 'scold':
            if (traits.goldenBoyEsteem > 1) traits.goldenBoyEsteem -= 1;
            break;
        case 'reward':
            if (traits.goldenBoyEsteem < 95) traits.goldenBoyEsteem += 5;
            break;
        case 'stabilize':
            traits.goldenBoyEsteem = 75;
            break;
        default:
            traits.goldenBoyEsteem = 75;
    }

    rtm.sendMessage(response, message.channel);
    rtm.sendMessage('goldenboy Self Esteem levels: ' + traits.goldenBoyEsteem + ' %.', message.channel);
}


module.exports = {
    robotName,
    traits,
    changeStatus,
    haveFunPreword,
    checkSwears
};
