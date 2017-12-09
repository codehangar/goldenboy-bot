const integrations = require('./integrations');

const trelloCommands = ['idea:', 'blog post:', 'ch todo:'];
const togglCommands = ['toggl:'];
const noteCommands = ['save meeting notes:', 'print meeting notes:', 'clear meeting notes:', 'good news:', 'customer headline:', 'employee headline:'];
const helpCommands = ['help:', 'hello:'];
const statusCommands = ['sleep:', 'speak:', 'silence:', 'status:', 'uptime:'];
const funCommands = ['kill:', 'punish:', 'reward:'];
const swearCommands = ['swearjar:']; // to be expanded ?
const githubCommands = ['issue:'];
const mimicCommands = ['mimic:'];
const parkingCommands = ['parking:', 'parking this month:'];

let allCommands = funCommands.concat(swearCommands).concat(statusCommands).concat(helpCommands).concat(mimicCommands).concat(parkingCommands);

if (integrations.trello) {
    allCommands = allCommands.concat(noteCommands).concat(trelloCommands);
}
if (integrations.toggl) {
    allCommands = allCommands.concat(togglCommands);
}
if (integrations.github) {
    allCommands = allCommands.concat(githubCommands);
}

module.exports = {
    trelloCommands,
    togglCommands,
    noteCommands,
    helpCommands,
    statusCommands,
    funCommands,
    allCommands,
    swearCommands,
    githubCommands,
    mimicCommands,
    parkingCommands
};
