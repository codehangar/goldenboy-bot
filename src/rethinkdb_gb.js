const r = require('rethinkdb');
const connectionInfo = {
    host: process.env.RETHINK_HOST, // eslint-disable-line no-undef
    port: process.env.RETHINK_PORT, // eslint-disable-line no-undef
    user: process.env.RETHINK_USER,
    password: process.env.RETHINK_PASS,
    db: 'goldenboy_db'
};
const usersTable = 'users';
const tableExistsMsg = 'Table `' + connectionInfo.db + '.' + usersTable + '` already exists.';
let connection = null;

function createUsersTable(conn) {
    return new Promise((resolve, reject) => {
        r.tableCreate(usersTable, {
            primaryKey: 'id'
        }).run(conn).then((res) => {
            console.log('createUsersTable', res); // eslint-disable-line no-console
            resolve();
        }).catch((err) => {
            if (err.name === 'ReqlOpFailedError' && err.msg === tableExistsMsg) {
                resolve();
            } else {
                reject(err);
            }
        });
    });
}

function initConnection() {
    return new Promise((resolve, reject) => {
        r.connect(connectionInfo).then(conn => {
            conn.on('close', () => {
                console.warn('------------------------------------------------------'); // eslint-disable-line no-console
                console.warn('*********** closed a database connection *************'); // eslint-disable-line no-console
                console.warn('------------------------------------------------------'); // eslint-disable-line no-console
            });
            createUsersTable(conn).then(() => {
                resolve(conn);
            });
        }).catch(err => {
            reject(err);
        });
    });
}

function getConnection() {
    if (connection) {
        return connection;
    }
    connection = initConnection();
    return connection;
}

function createRethinkUsers(users) {
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
        getConnection().then(conn => {
            r.table(usersTable)
                .insert(users, {
                    conflict: (id, oldDoc, newDoc) => { // eslint-disable-line no-unused-vars
                        return oldDoc;
                    }
                })
                .run(conn)
                .then(resolve);
        });
    });
}

function incrementUserSwearCount(userId, addedSwears) {
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
        getConnection().then(conn => {
            r.table(usersTable)
                .get(userId)
                .update({
                    swear_count: r.row('swear_count').add(addedSwears)
                })
                .run(conn)
                .then(resolve);
        });
    });
}

function getSwearUsers() {
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
        getConnection().then(conn => {
            r.table(usersTable)
                .filter(r.row('swear_count').gt(0))
                .orderBy(r.desc('swear_count'))
                .run(conn)
                .then(resolve);
        });
    });
}

function getUserSwearCount(userId) {
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
        getConnection().then(conn => {
            r.table(usersTable)
                .get(userId)
                .getField('swear_count')
                .run(conn)
                .then(resolve);
        });
    });
}

module.exports = {
    createRethinkUsers,
    incrementUserSwearCount,
    getUserSwearCount,
    getSwearUsers
};
