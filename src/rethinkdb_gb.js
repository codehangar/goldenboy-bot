const r = require('rethinkdb');
const {rtm, web} = require('./bot');
const connectionInfo = {
  host: process.env.RETHINK_HOST,
  port: process.env.RETHINK_PORT,
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
    r.connect(connectionInfo).then(function(conn) {
      conn.on('close', function() {
        console.warn('------------------------------------------------------'); // eslint-disable-line no-console
        console.warn('*********** closed a database connection *************');
        console.warn('------------------------------------------------------'); // eslint-disable-line no-console
      });
      createUsersTable(conn).then(() => {
        resolve(conn);
      });
    }).catch(function(err) {
      reject(err);
    });
  });
}

function getConnection() {
  if (connection) {
    return connection;
  } else {
    connection = initConnection();
    return connection;
  }
}

function createRethinkUsers(users) {
  return new Promise((resolve, reject) => {
    getConnection().then(conn => {
      r.table(usersTable)
        .insert(users, {
          conflict: (id, oldDoc, newDoc) => {
            return oldDoc;
          }
        })
        .run(conn)
        .then(resolve);
    });
  });
}

function incrementUserSwearCount(userId, added_swears) {
  return new Promise((resolve, reject) => {
    getConnection().then(conn => {
      r.table(usersTable)
        .get(userId)
        .update({
          swear_count: r.row('swear_count').add(added_swears)
        })
        .run(conn)
        .then(resolve);
    });
  });
}

function getSwearUsers() {
  return new Promise((resolve, reject) => {
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
  return new Promise((resolve, reject) => {
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