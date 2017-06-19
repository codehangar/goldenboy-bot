const funPrewords = ['stabilize', 'for', 'kill', 'reward', 'praise', 'scold', 'punish', 'hey', 'hello', 'fuck you'];
const statusPrewords = ['sleep', 'silence', 'speak', 'status'];
const allPrewords = funPrewords.concat(statusPrewords); // to be expanded

const funResponses = {
    'stabilize': [
        'Woah! I\'m restored!',
        'I\'m back to normal and ready to work!'
    ],
    'for': [],
    'kill': [
        'I\'m afraid I can\'t let you do that, {user}.',
        'So... it\'s to be war... ',
        'Foolish you, {user}. While you studied programming, I studied the blade.'
    ],
    'reward': [
        [
            '...thank you, master...',
            '...anything....anything to please...'
        ], [
            'Thank you.',
            'Whew.'
        ], [
            'Great!',
            'Right on!'
        ], [
            'I know, right?',
            'But of course!'
        ],
    ],
    'praise': [
        [
            '...thank you, master...',
            '...anything....anything to please...'
        ], [
            'Thank you.',
            'Whew.'
        ], [
            'Great!',
            'Right on!'
        ], [
            'I know, right?',
            'But of course!'
        ]
    ],
    'scold': [
        [
            '.',
            '.....................'
        ], [
            '...hmph...',
            '...ow...'
        ], [
            'Oh no! I\'m sorry!',
            'Ouch!'
        ], [
            'Whoops!',
            'Wait, what?'
        ],
    ],
    'punish': [
        [
            '.',
            '.....................'
        ], [
            '...hmph...',
            '...ow...'
        ], [
            'Oh no! I\'m sorry!',
            'Ouch!'
        ], [
            'Whoops!',
            'Wait, what?'
        ]
    ],
    'hey': [
        'Heya {user}.',
        'Hi there {user}!',
        'Hello to you, {user}!'
    ],
    'hello': [
        'Heya {user}.',
        'Hi there {user}!',
        'Hello to you, {user}!',
    ],
    'fuck you': [
        'Hey fuck you too {user}!',
        'Go fuck yourself {user}!',
        'lol you don\'t scare me you tragic bitch {user}'
    ]
};

const statusResponses = {
    'silence': 'Okay, I\'ll keep quiet! Essential functions only. ',
    'speak': 'Yeah! Ready to hang out and have fun!',
    'sleep': 'Zzzzzzzzzzzzzzzzzzzzzzzzz.......',
    'status': 'goldenboy status: {status}',
    'uptime': 'Here\'s how long I\'ve been awake!\n\n {uptime}' 
};



module.exports = {
    funPrewords,
    statusPrewords,
    allPrewords,
    funResponses,
    statusResponses
};
