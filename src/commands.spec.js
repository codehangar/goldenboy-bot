describe('commands', () => {
    beforeEach(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.resetCache();
    });

    describe('with integrations enabled', () => {
        beforeEach(() => {
            mockery.registerMock('./integrations', {
                trello: true,
                toggl: true,
                github: true
            });
        });

        it('should include trello and notes commands if trello integration is enabled', () => {
            const { allCommands, trelloCommands, noteCommands } = require('./commands');
            trelloCommands.forEach((cmd) => {
                expect(allCommands).to.contain(cmd);
            });
            noteCommands.forEach((cmd) => {
                expect(allCommands).to.contain(cmd);
            });
        });

        it('should include toggl commands if trello integration is enabled', () => {
            const { allCommands, togglCommands } = require('./commands');
            togglCommands.forEach((cmd) => {
                expect(allCommands).to.contain(cmd);
            });
        });

        it('should include github commands if trello integration is enabled', () => {
            const { allCommands, githubCommands } = require('./commands');
            githubCommands.forEach((cmd) => {
                expect(allCommands).to.contain(cmd);
            });
        });
    });

    describe('with integrations disabled', () => {
        beforeEach(() => {
            mockery.registerMock('./integrations', {
                trello: false,
                toggl: false,
                github: false
            });
        });

        it('should not include trello and notes commands if trello integration is disabled', () => {
            const { allCommands, trelloCommands, noteCommands } = require('./commands');
            trelloCommands.forEach((cmd) => {
                expect(allCommands).to.not.contain(cmd);
            });
            noteCommands.forEach((cmd) => {
                expect(allCommands).to.not.contain(cmd);
            });
        });

        it('should not include toggl commands if trello integration is disabled', () => {
            const { allCommands, togglCommands } = require('./commands');
            togglCommands.forEach((cmd) => {
                expect(allCommands).to.not.contain(cmd);
            });
        });

        it('should not include github commands if trello integration is disabled', () => {
            const { allCommands, githubCommands } = require('./commands');
            githubCommands.forEach((cmd) => {
                expect(allCommands).to.not.contain(cmd);
            });
        });
    });
});
