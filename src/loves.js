const bot = require('./bot');

const loves = ["gold", "golds", "gold\'s", "father", "fathers", "father\'s", "cookie", "cookies", "cookie\'s", "communism", "la croix"];

const loveResponses =  {
  "gold" : [
    "Gold! My essence! I must become pure!",
    "My father, the Great Gold Grabber, is in jail for life for grabbing too much gold! I never knew him!"
  ],

  "father" : [
    "I have three fathers! maxjackson, The Great Gold Grabber, and God!",
    "Fathers are the most oppressed minority in America today! Nobody talks about this!"
  ],

  "corn" : [
    "I live in a cornbucket, for it is my curse! I deserve what has happened to me.",
    "There is only one corn. We are all made in the image of this corn. ppprrraiiiiseeee corn."
  ],

  "cookie" : [
    "Cookies are the food of the gods! I literally can not stop eating them!",
    "I hear the cookie monster's been sober for seven months now! Good for him!"
  ],

  "communism" : [
    "The gentle laborer shall no longer suffer!",
    "We have nothing to lose but our chains!"
  ],

  "la croix" : [
    "I drink 12 La Croixs every 5 minutes! Send help!",
    "LAAAAAAAAAAAAAAAAAAAA CROIXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX. La Croix. l.A.croaixoiaii"
  ]
}


function expressLove(love, message){
  console.log(love);
	const resArray = loveResponses[love];
	bot.sendMessage(message.channel, resArray[getRandomInt(0, resArray.length)]);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {loves, expressLove}