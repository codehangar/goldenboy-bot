const { meetingNotes } = require('../test/mock-data/trello-data');

describe('trello', () => {
    beforeEach(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        mockery.registerMock('node-trello', sinon.stub());
    });

    describe('#parseMeetingNoteItems', () => {
        it('should parse Good News meeting notes items', () => {
            const { parseMeetingNoteItems } = require('./trello');

            const actual   = parseMeetingNoteItems(meetingNotes, 'Good News');
            const expected = [
                '- good news item 1',
                '- good news item 2',
                '- good news item 3',
            ];
            expect(actual).to.deep.equal(expected);
        });
        it('should parse Employee Headlines meeting notes items', () => {
            const { parseMeetingNoteItems } = require('./trello');

            const actual   = parseMeetingNoteItems(meetingNotes, 'Employee Headlines');
            const expected = [
                '- employee headline item 1',
                '- employee headline item 2',
                '- employee headline item 3',
            ];
            expect(actual).to.deep.equal(expected);
        });
        it('should parse Customer Headlines meeting notes items', () => {
            const { parseMeetingNoteItems } = require('./trello');

            const actual   = parseMeetingNoteItems(meetingNotes, 'Customer Headlines');
            const expected = [];
            expect(actual).to.deep.equal(expected);
        });
    });

    describe('#noteToString', () => {
        it('should properly format a new meeting note message with a leading space', () => {
            const { noteToString } = require('./trello');

            const message = {
                text: ' we won the lottery!',
                user: 'grailian'
            };

            const actual   = noteToString(message);
            const expected = '- we won the lottery! (added by grailian)';
            expect(actual).to.deep.equal(expected);
        });

        it('should properly format a new meeting note message with no leading space', () => {
            const { noteToString } = require('./trello');

            const message = {
                text: 'we won the lottery!',
                user: 'grailian'
            };

            const actual   = noteToString(message);
            const expected = '- we won the lottery! (added by grailian)';
            expect(actual).to.deep.equal(expected);
        });
    });
});
