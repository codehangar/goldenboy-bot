// No third party module required: https is part of the Node.js API
const https = require('https');
const {rtm} = require('./bot');
const url = 'https://cfo-event-parking.herokuapp.com/events';

function getParkingDates() {
    https.get(url, res => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', data => {
            body += data;
        });
        res.on('end', () => {
            body = JSON.parse(body);
            console.log('body', body); // eslint-disable-line no-console
            console.log('typeof body', typeof body); // eslint-disable-line no-console
            return body;
        });
    });
}

function getToday() {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if(dd < 10) {
        dd = '0' + dd;
    }
    if(mm < 10) {
        mm = '0' + mm;
    }
    const todayString = yyyy + '-' + mm + '-' + dd;
    return todayString;
}

function thereIsParkingToday() {
    return getParkingDates().includes(getToday());
}

function checkParking(command, message) {
    switch(command) {
        case 'parking:':
            if(thereIsParkingToday()) {
                rtm.sendMessage('parking...today...yes...', message.channel);
                break;
            } else {
                rtm.sendMessage('no PARKING. NO PARKING NO PARKING NO PARKING', message.channel);
                break;
            }
        case 'parking this month:':
            const parkingDates = getParkingDates();
            console.log('parkingDates', parkingDates); // eslint-disable-line no-console
            rtm.sendMessage('Here are the dates: ' + getParkingDates().toString(), message.channel);
            break;
        default:
            return;
    }
}

module.exports = {
    getParkingDates, getToday, thereIsParkingToday, checkParking
};
