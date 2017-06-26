describe('integrations', () => {
    beforeEach(() => {
    });

    it('should set integrations to false if values are not set on the environment', () => {
        const integrations = require('./integrations').get();

        expect(integrations.trello).to.equal(false);
        expect(integrations.github).to.equal(false);
        expect(integrations.toggl).to.equal(false);
        expect(integrations.rethinkdb).to.equal(false);
    });

    it('should set integrations to true if values are set on the environment', () => {
        process.env.TRELLO_KEY   = 'test';
        process.env.TRELLO_TOKEN = 'test';
        process.env.GITHUB_TOKEN = 'test';
        process.env.TOGGL_TOKEN  = 'test';
        process.env.RETHINK_HOST = 'test';
        process.env.RETHINK_PORT = 'test';

        const integrations = require('./integrations').get();

        expect(integrations.trello).to.equal(true);
        expect(integrations.github).to.equal(true);
        expect(integrations.toggl).to.equal(true);
        expect(integrations.rethinkdb).to.equal(true);
    });
});
