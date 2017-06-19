const TogglClient = require('toggl-api');
const toggl = new TogglClient({apiToken: process.env.TOGGL_TOKEN}); // eslint-disable-line no-undef
const moment = require('moment');
const {rtm} = require('./bot');



function togglReport(messageText, messageChannel) {
    const periods = ['w', 'm'];
    const message_clients = ['mxc', 'mc', 'gmg', 'cfp'];
  
    const text = messageText.split(':')[1];
     
    const helpMessage = 'Available toggl commands\n toggl: help - display this message\n toggl: [client] return a toggl report for a given client \ntoggl: [period] [client] - return a toggl report for a given client over a given period\n toggl: clients - list the client ids for toggle reports\n toggle: periods - list the periods for the client reports';
  


    if (text.indexOf('help') > 0){
        rtm.sendMessage(helpMessage, messageChannel);
    } else if (text.indexOf('clients') > 0){
        const clientsMessage = 'Clients: ' + message_clients.join(' ');
        rtm.sendMessage(clientsMessage, messageChannel);
    } else if (text.indexOf('periods') > 0){
        const periodsMessage = 'Periods: ' + periods.join(' ');
        rtm.sendMessage(periodsMessage, messageChannel);
    } else if (text.length == 0){
        rtm.sendMessage(helpMessage, messageChannel);
  
    } else  { 
        const period = periods.find(p => text.split(' ').find(chunk => chunk === p) === p);
        const client = message_clients.find(c => text.split(' ').find(chunk => chunk === c) === c);
    
        const {periodName, since, until} = getDateRange(period);
        const {clientName, client_ids} = getClient(client);
    
        toggl.summaryReport({
            user_agent: process.env.TOGGL_USER_AGENT, // eslint-disable-line no-undef
            workspace_id: process.env.TOGGL_WORKSPACE, // eslint-disable-line no-undef
            billable: 'both',
            client_ids,
            since,
            until
        }, (err, res) => {
            const time = secondsToHours(res.total_grand / 1000);
            const url = `https://www.toggl.com/app/reports/summary/${process.env.TOGGL_WORKSPACE}/period/${periodName}/clients/${client_ids}/billable/both`; // eslint-disable-line no-undef
            rtm.sendMessage(`*${time}* spent on *${clientName}* _${periodName}_\n${url}`, messageChannel);
        });
    }
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



