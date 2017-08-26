function get() {
    const integrations     = {};
    integrations.trello    = !!process.env.TRELLO_KEY && !!process.env.TRELLO_TOKEN;// eslint-disable-line no-undef
    integrations.github    = !!process.env.GITHUB_TOKEN;// eslint-disable-line no-undef
    integrations.toggl     = !!process.env.TOGGL_TOKEN;// eslint-disable-line no-undef
    integrations.rethinkdb = !!process.env.RETHINK_HOST && !!process.env.RETHINK_PORT;// eslint-disable-line no-undef
    return integrations;
}

// console.log('integrations', integrations); // eslint-disable-line no-console
module.exports = get();

/**
 * This method has been attached so that it can be tested while changing process.env values
 */
module.exports.get = get;
