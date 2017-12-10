// No third party module required: https is part of the Node.js API
const https = require('https');
const {rtm} = require('./bot');
const url = 'https://cfo-event-parking.herokuapp.com/events';

function getParkingDates(message) {
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
            for(let i = 0; i<arr.length; i++) {
                console.log('i', i);
                console.log('body[i]', body[i]);
            }
            // rtm.sendMessage('Here are the dates: ' + body.stringify(), message.channel);
            return;
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

function thereIsParkingToday(message) {
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
            console.log('parkingDates', body); // eslint-disable-line no-console
            const today = getToday();
            console.log('today', today); // eslint-disable-line no-console
            if(body.contains(today)) {
                rtm.sendMessage('parking...today...yes...', message.channel);
            } else {
                rtm.sendMessage('no PARKING. NO PARKING NO PARKING NO PARKING', message.channel);
            }
            //rtm.sendMessage('Here are the dates: ' + body.toString(), message.channel);
            return;
        });
    });
}

function checkParking(command, message) {
    switch(command) {
        case 'parking:':
            thereIsParkingToday(message);
            break;
        case 'parking this month:':
            getParkingDates(message);
            break;
        default:
            return;
    }
}

module.exports = {
    getParkingDates, getToday, thereIsParkingToday, checkParking
};
