const integrations = require('./integrations');

let createRethinkUsers;
let getSwearUsers;
if (integrations.rethinkdb) {
    createRethinkUsers = require('./rethinkdb_gb').createRethinkUsers;
    getSwearUsers = require('./rethinkdb_gb').getSwearUsers;
}

let users = [];
const swearJar = [];

function updateUsers(data) {
    users = data.members;
    if (integrations.rethinkdb) {
        createRethinkUsers(users.map(member => {
            return {
                id: member.id,
                username: member.name,
                swear_count: 0
            };
        }));
    } else {
        users.map(member => {
            swearJar[member.name] = 0;
        });
    }
}

function getUsernameFromId(id) {
    const user = users.find(u => u.id === id);
    return user ? user.name : 'unknown member';
}

function updateSwearJar(id, swearCount) {
    swearJar[getUsernameFromId(id)] += swearCount;
}

function getIdFromUsername(username) {
    const user = users.find(u => u.username === username);
    return user ? user.id : '0';
}

function listUsers() {
    return users;
}

function getSwearJarUser(username) {
    return swearJar[username];
}

function getSwearJar() {
    if (integrations.rethinkdb) {
        return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
            getSwearUsers().then((dbUsers) => {
                const longestName = dbUsers.reduce((agg, user) => agg > user.username.length ? agg : user.username.length, 0);
                resolve(dbUsers.map((user, i) => {
                    const padding = new Array((longestName - user.username.length) + 1).join(' ');
                    return `${i + 1}. ${user.username + padding} with ${user.swear_count} swears`;
                }));
            });
        });
    }

    return swearJar;
}


module.exports = {
    listUsers,
    updateUsers,
    getUsernameFromId,
    getSwearJar,
    updateSwearJar,
    getSwearJarUser,
    getIdFromUsername
};
