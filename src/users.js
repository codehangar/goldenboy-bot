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
      const longestName = users.reduce((agg, user) => agg > user.username.length ? agg : user.username.length, 0);
      resolve(users.map((user, i) => {
        const padding = new Array((longestName - user.username.length) + 1).join(' ');
        return `${i + 1}. ${user.username + padding} with ${user.swear_count} swears`
      }));
    });
  });
}

/*function getUserSwearCount(user){
<<<<<<< HEAD
=======

>>>>>>> b7d4adc9e74589a7086df36830169dd880a69d95
 return getUserSwearCount(user);
 } */


module.exports = {
  listUsers,
  updateUsers,
  getUsernameFromId,
  getSwearJar
<<<<<<< HEAD
};
=======
};
>>>>>>> b7d4adc9e74589a7086df36830169dd880a69d95
