// No third party module required: https is part of the Node.js API
const https = require('https');
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
            return body;
        });
    });
}

function getToday() {
    const today = new Date(); 
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();
    if(dd<10){
        dd = '0'+ dd;
    } 
    if(mm<10){
        mm = '0'+ mm;
    } 
    const today_string = yyyy + '-' + mm + '-' + dd;
    return today_string;
  }

function thereIsParkingToday() {
    return getParkingDates().includes(getToday())
}

module.exports = {
    getParkingDates, getToday, thereIsParkingToday
};
