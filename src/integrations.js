let allIntegrationsValid = true;

try {
    const Trello = require("node-trello");
    const GitHubApi = require("github");
    const TogglClient = require('toggl-api');
    const moment = require('moment');
    const r = require('rethinkdb');

    allIntegrationsValid = (process.env.TRELLO_KEY != null && process.env.TRELLO_TOKEN != null && process.env.GITHUB_TOKEN != null && 
        process.env.TOGGL_TOKEN != null && process.env.RETHINK_HOST != null && process.env.RETHINK_PORT != null);
    } catch(err) {
    allIntegrationsValid = false;
}

module.exports = {allIntegrationsValid}