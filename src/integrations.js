let integrationsValid = {};


try {
    console.log("Trying trello");
    const Trello = require("node-trello");
    integrationsValid["trello"] = (process.env.TRELLO_KEY != null && process.env.TRELLO_TOKEN != null);
}   catch(err){
    integrationsValid["trello"] = false;
}


try {
    const Trello = require("github");
    integrationsValid["github"] = (process.env.GITHUB_TOKEN != null);
}   catch(err){
    integrationsValid["github"] = false;
}
try {
    const Toggl = require("toggl-api");
    integrationsValid["toggl"] = (process.env.TOGGL_TOKEN != null);
}   catch(err){
    integrationsValid["toggl"] = false;
}

try {
    const moment = require("moment");
    integrationsValid["moment"] = true
}   catch(err){
    integrationsValid["moment"] = false;
}

try {
    const r = require("rethinkdb");
    integrationsValid["rethinkdb"] = (process.env.RETHINK_HOST != null && process.env.RETHINK_PORT != null);
}   catch(err){
    integrationsValid["rethinkdb"] = false;
}

console.log(integrationsValid);
module.exports = {integrationsValid}
