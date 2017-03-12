const bot = require('./bot');

const hates = ["microsoft", "hitler", "nazi", "nazis", "aaron blankenship"]
const hateResponses =  {
  "aaron blankenship": [
    "Aaron Blankenship deserves a lifetime of fear and pain as far as I'm concerned! Wow! :smiley: :joy:",
    "Fantasies of Aaron Blankenship's violent death bring me great comfort and joy in my daily life as a bot! Let's make it happen! :knife: :skull:"
  ]
}


function expressHatred(hate, message){
	const resArray = hateResponses[hate];
	bot.sendMessage(message.channel, resArray[getRandomInt(0, resArray.length)]);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {hates, expressHatred}