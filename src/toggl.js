const TogglClient = require('toggl-api');
const toggl = new TogglClient({apiToken: process.env.TOGGL_TOKEN});
const moment = require('moment');
const bot = require('./bot');

function togglReport(messageText, messageChannel) {
  const text = messageText.split(':')[1];
  const period = ['w', 'm'].find(p => text.split(' ').find(chunk => chunk === p) === p);
  const client = ['mxc', 'mc', 'gmg', 'cfp'].find(c => text.split(' ').find(chunk => chunk === c) === c);

  const {periodName, since, until} = getDateRange(period);
  const {clientName, client_ids} = getClient(client);

  toggl.summaryReport({
    user_agent: process.env.TOGGL_USER_AGENT,
    workspace_id: process.env.TOGGL_WORKSPACE,
    billable: 'both',
    client_ids,
    since,
    until
  }, (err, res) => {
    const time = secondsToHours(res.total_grand / 1000);
    const url = `https://www.toggl.com/app/reports/summary/${process.env.TOGGL_WORKSPACE}/period/${periodName}/clients/${client_ids}/billable/both`;
    bot.sendMessage(messageChannel, `*${time}* spent on *${clientName}* _${periodName}_\n${url}`);
  });
}

function getClient(client = 'mxc') {
  switch (client) {
    case 'mxc':
    case 'mc':
      return {clientName: 'MatrixCare', client_ids: '17794462'};
    case 'gmg':
      return {clientName: 'Grail Management Group', client_ids: '18593760'};
    case 'cfp':
      return {clientName: 'Career Fair Plus', client_ids: '19450743'};
  }
}

function getDateRange(period = 'm') {
  switch (period) {
    case 'w':
      return {
        periodName: 'thisWeek',
        since: moment().startOf('week').format('YYYY-MM-DD'),
        until: moment().endOf('week').format('YYYY-MM-DD')
      };
    case 'm':
    default:
      return {
        periodName: 'thisMonth',
        since: moment().startOf('month').format('YYYY-MM-DD'),
        until: moment().endOf('month').format('YYYY-MM-DD')
      };
  }
}

function secondsToHours(seconds) {
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

module.exports = {
  togglReport
};


const clients = [
  {
    "id": 19723430, "wid": 1161478, "name": "Consulting", "at": "2017-01-25T05:36:14+00:00"
  }, {
    "id": 19450743, "wid": 1161478, "name": "Career Fair Plus", "at": "2016-11-17T03:37:22+00:00"
  }, {
    "id": 19440188, "wid": 1161478, "name": "Skillcrush", "at": "2016-11-15T01:25:19+00:00"
  }, {
    "id": 19440187, "wid": 1161478, "name": "Lady Devs", "at": "2016-11-15T01:23:49+00:00"
  }, {
    "id": 19440185, "wid": 1161478, "name": "Cassie Personal", "at": "2016-11-15T01:23:03+00:00"
  }, {
    "id": 19440182, "wid": 1161478, "name": "Adfodela", "at": "2016-11-15T01:22:10+00:00"
  }, {
    "id": 19440179, "wid": 1161478, "name": "Code Hangar", "at": "2016-11-15T01:21:44+00:00"
  }, {
    "id": 18069423, "wid": 1161478, "name": "StrategyHack", "at": "2016-01-12T15:02:26+00:00"
  }, {
    "id": 17712980, "wid": 1161478, "name": "Greg Young", "at": "2015-10-27T22:28:50+00:00"
  }, {
    "id": 18263115, "wid": 1161478, "name": "D'vorah Graeser", "at": "2016-02-15T16:20:34+00:00"
  }, {
    "id": 17881368, "wid": 1161478, "name": "Highwinds", "at": "2015-12-02T03:05:16+00:00"
  }, {
    "id": 17881386, "wid": 1161478, "name": "Effin Amazing", "at": "2015-12-02T03:23:56+00:00"
  }, {
    "id": 17829315, "wid": 1161478, "name": "Steve Alexander", "at": "2015-11-20T20:15:41+00:00"
  }, {
    "id": 18593729, "wid": 1161478, "name": "CH Utils", "at": "2016-04-17T19:10:00+00:00"
  }, {
    "id": 18593738, "wid": 1161478, "name": "CH Products", "at": "2016-04-17T19:18:19+00:00"
  }, {
    "id": 18593760, "wid": 1161478, "name": "Grail Management Group", "at": "2016-04-17T19:23:19+00:00"
  }, {
    "id": 17794462, "wid": 1161478, "name": "MatrixCare", "at": "2016-10-25T11:58:24+00:00"
  }
];
