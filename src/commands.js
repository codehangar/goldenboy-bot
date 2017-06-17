const {integrationsValid} = require('./integrations');

const trelloCommands = ['idea:', 'blog post:', 'ch todo:'];
const togglCommands = ['toggl:'];
const noteCommands = ['save meeting notes:', 'print meeting notes:', 'clear meeting notes:', 'good news:', 'customer headline:', 'employee headline:'];
const helpCommands = ['help:', 'hello:'];
const statusCommands = ['sleep:', 'speak:', 'silence:', 'status:', 'uptime:'];
const funCommands = ['kill:', 'punish:', 'reward:'];
const swearCommands = ['swearjar:']; // to be expanded ?
const githubCommands = ['issue:'];
const mimicCommands = ['mimic:'];

let allCommands = funCommands.concat(swearCommands).concat(statusCommands).concat(helpCommands).concat(mimicCommands);

if (integrationsValid['trello']) {
    allCommands = allCommands.concat(noteCommands).concat(trelloCommands);
}
if (integrationsValid['toggl']) {
    allCommands = allCommands.concat(togglCommands);
}
if (integrationsValid['github']){
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
    mimicCommands
};
