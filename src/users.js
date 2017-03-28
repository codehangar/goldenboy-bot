const {createRethinkUsers, incrementUserSwearCount, getSwearUsers} = require('./rethinkdb_gb');

let users = [];

function updateUsers(data) {
  users = data.members;
  createRethinkUsers(users.map(member => {
    return {
      id: member.id,
      username: member.name,
      swear_count: 0
    }
  }));
}

function updateSwearJar(user) {
  incrementUserSwearCount(user);
}

function getUsernameFromId(id) {
  const user = users.find(user => user.id === id);
  return user ? user.name : "unknown member";
}

function listUsers() {
  return users;
}

function getSwearJar() {
  return new Promise((resolve, reject) => {
    getSwearUsers().then((users) => {
      resolve(users.map(user => `${user.username} - ${user.swear_count}`));
    });
  });
}

/*function getUserSwearCount(user){

 return getUserSwearCount(user);
 } */


module.exports = {
  listUsers,
  updateUsers,
  getUsernameFromId,
  getSwearJar
};
