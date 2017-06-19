let integrationsValid = {};


try {  
    const _ = require('node-trello');// eslint-disable-line no-unused-vars 
    integrationsValid['trello'] = (process.env.TRELLO_KEY != null && process.env.TRELLO_TOKEN != null);// eslint-disable-line no-undef
}   catch(err){
    integrationsValid['trello'] = false;
}


try {
    const _ = require('github');// eslint-disable-line no-unused-vars 
    integrationsValid['github'] = (process.env.GITHUB_TOKEN != null);// eslint-disable-line no-undef
}   catch(err){
    integrationsValid['github'] = false;
}
try {
    const _ = require('toggl-api');// eslint-disable-line no-unused-vars 
    integrationsValid['toggl'] = (process.env.TOGGL_TOKEN != null);// eslint-disable-line no-undef 
}   catch(err){
    integrationsValid['toggl'] = false;
}

try {
    const _ = require('moment'); // eslint-disable-line no-unused-vars 
    integrationsValid['moment'] = true;
}   catch(err){
    integrationsValid['moment'] = false;
}

try {
    const _ = require('rethinkdb');// eslint-disable-line no-unused-vars 
    integrationsValid['rethinkdb'] = (process.env.RETHINK_HOST != null && process.env.RETHINK_PORT != null);// eslint-disable-line no-undef
}   catch(err){
    integrationsValid['rethinkdb'] = false;
}

console.log('integrationsValid', integrationsValid); // eslint-disable-line no-console
module.exports = {integrationsValid};
