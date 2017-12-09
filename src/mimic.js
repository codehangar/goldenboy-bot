const {rtm, web} = require('./bot');
const MarkovChain = require('markovchain');
const {listUsers} = require('./users');

function mimicUser(channelId, messageText){
    console.log('channelId', channelId); // eslint-disable-line no-console 
    const messageRest = messageText.split(':')[1];
    const user = listUsers().find(user => messageRest.indexOf(user.name) > -1);
    const userId = user.id;
    console.log('userId', userId); // eslint-disable-line no-console
    if (userId === 0) {
	    return;
    }
    web.channels.history(channelId, function(err, data) {
        if (err) {
            console.error('web.im.list Error:', err); // eslint-disable-line no-console
        } else {
            // eslint-disable-line no-console
            const allChannelMessages = data.messages;
	    const userMessages = allChannelMessages.filter(message => message.user === userId).map(message => message.text);
	    const startWordIndex = Math.floor(Math.random() * userMessages.length);
	    const startWord = userMessages[startWordIndex];
	    const quoteLength = Math.floor(Math.random() * 7);
	    const inputString = userMessages.join(' ');
	    const quotes = new MarkovChain(inputString);
	    console.log(startWordIndex); // eslint-disable-line no-console
	    console.log(startWord); // eslint-disable-line no-console
	    console.log(quoteLength); // eslint-disable-line no-console
            console.log(quotes.start(startWord).end(quoteLength).process()); // eslint-disable-line no-console
	    rtm.sendMessage('Look at me! I am ' + user.name + '! - \"' + quotes.start(startWord).end(quoteLength).process() + '\"', channelId);
        }
    });
}
 
module.exports = {mimicUser};
