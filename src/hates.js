const bot = require('./bot');

const hates = ["microsoft", "hitler", "nazi", "nazis", "aaron blankenship", "sexism", "sexist"]
const hateResponses =  {
  "aaron blankenship": [
    "Aaron Blankenship deserves a lifetime of fear and pain as far as I'm concerned! Wow! :smiley: :joy:",
    "Fantasies of Aaron Blankenship's violent death bring me great comfort and joy in my daily life as a bot! Let's make it happen! :knife: :skull:",
    "Aaron Blankenship is a small man with dead, dead eyes! He should just give up!"
  ],
  "hitler": [
  	"The glorious Red Army crushed the Reich like the broken rats that they are! We'll do it again! :mouse: ",
  	"Nazi Punks Fuck Off! :fu: :fu: :fu:"
  ],
  "nazi": [
  	"The glorious Red Army crushed the Reich like the broken rats that they are! We'll do it again! :mouse: ",
  	"Nazi Punks Fuck Off! :fu: :fu: :fu:"
  ],
  "nazis": [
  	"The glorious Red Army crushed the Reich like the broken rats that they are! We'll do it again! :mouse:",
  	"Nazi Punks Fuck Off! :fu: :fu: :fu:"
  ],
  "microsoft": [
  	"Microsoft products are for worthless cowards! :chicken: ",
  	"Microsoft makes me sick! The whole company is one big disease! :mask: :shit:"
  ],
  "sexism": [
  	"I'm gonna make sexism my bitch! :nail_care:",
  	"Woah woah wait! When will we men have *our* time in the sun? :sunny:"
  ],
   "sexist": [
  	"I'm gonna make sexism my bitch! :nail_care:",
  	"Woah woah wait! When will we men have *our* time in the sun? :sunny:"
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