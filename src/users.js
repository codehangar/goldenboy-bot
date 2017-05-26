const {allIntegrationsValid} = require('./integrations')
if (allIntegrationsValid){ 
  var {createRethinkUsers, incrementUserSwearCount, getSwearUsers} = require('./rethinkdb_gb');
} 

let users = [];
let swearJar = [];

function updateUsers(data) {
  users = data.members;
  if(allIntegrationsValid){
    createRethinkUsers(users.map(member => {
      return {
        id: member.id,
        username: member.name,
        swear_count: 0
      }
    }));
  } else {
    users.map(member => {
      swearJar[member.name] = 0;
    });
  }
}

function updateSwearJar(id, swearCount) {
  console.log(id);
  console.log(swearCount);
  swearJar[getUsernameFromId(id)] += swearCount;
}

function getUsernameFromId(id) {
  const user = users.find(user => user.id === id);
  return user ? user.name : "unknown member";
}

function listUsers() {
  return users;
}

function getSwearJarUser(username) {
  return swearJar[username]
}

function getSwearJar() {
  if(allIntegrationsValid){
    return new Promise((resolve, reject) => {
      getSwearUsers().then((users) => {
        const longestName = users.reduce((agg, user) => agg > user.username.length ? agg : user.username.length, 0);
        resolve(users.map((user, i) => {
          const padding = new Array((longestName - user.username.length) + 1).join(' ');
          return `${i + 1}. ${user.username + padding} with ${user.swear_count} swears`
        }));
      });
    });
  } else {
    return swearJar
  }
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
  getSwearJar, 
  updateSwearJar,
  getSwearJarUser
};