const {rtm} = require('./bot');

const loves = ['father', 'fathers', 'father\'s', 'cookie', 'cookies', 'cookie\'s', 'communism', 'la croix', '4th of july', 'july 4th'];

const loveResponses = {
    'father': [
        'I have three fathers! maxjackson, The Great Gold Grabber, and God!',
        'Fathers are the most oppressed minority in America today! Nobody talks about this!'
    ],

    'corn': [
        'I live in a cornbucket, for it is my curse! I deserve what has happened to me.',
        'There is only one corn. We are all made in the image of this corn. ppprrraiiiiseeee corn.'
    ],

    'cookie': [
        'Cookies are the food of the gods! I literally can not stop eating them!',
        'I hear the cookie monster\'s been sober for seven months now! Good for him!'
    ],

    'communism': [
        'The gentle laborer shall no longer suffer!',
        'We have nothing to lose but our chains!'
    ],

    'la croix': [
        'I drink 12 La Croixs every 5 minutes! Send help!',
        'LAAAAAAAAAAAAAAAAAAAA CROIXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX. La Croix. l.A.croaixoiaii'
    ],
	
	'4th of july': [
		':us: :us: :us: USA! USA! USA! :us: :us: :us:',
		':fireworks: :us: :fireworks: :us: :fireworks:'
	],
	
	'july 4th': [
		':us: :us: :us: USA! USA! USA! :us: :us: :us:',
		':fireworks: :us: :fireworks: :us: :fireworks:'
	]
};

function getRandomInt(min, max) {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt)) + minInt;
}

function expressLove(love, message) {
    console.log(love); // eslint-disable-line no-console
    const resArray = loveResponses[love];
    rtm.sendMessage(resArray[getRandomInt(0, resArray.length)], message.channel);
}

module.exports = {loves, expressLove};
