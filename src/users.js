const {createRethinkUser, incrementUserSwearCount, getUserSwearCount} = require('./rethinkdb_gb');

let users = [];
//let swearJar = [];

function updateUsers(data) {
  users = data.members;
  users.forEach(function(user){
    createRethinkUser(user.name)
  	//swearJar[user.name] = 0;
	}
	)};

function updateSwearJar(user, swearCount){

	//swearJar[user] += swearCount;
  incrementUserSwearCount(user);
	//console.log(swearJar);
}

function getUsernameFromId(id) {
  const user = users.find(user => user.id === id);
  return user ? user.name : "unknown member";
}

function listUsers() {
  return users;
}

/*function getSwearJar(){
	return swearJar;
} */

/*function getUserSwearCount(user){

	return getUserSwearCount(user);
} */


module.exports = {
  listUsers,
  updateUsers,
  getUsernameFromId
};
