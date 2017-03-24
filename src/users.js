let users = [];
let swearJar = [];

function updateUsers(data) {
  users = data.members;
  users.forEach(function(user){
  	/*swearJar.push(
  	{
  		username: user.name,
  		swearCount: 0
  	}); */
  	swearJar[user.name] = 0;
	}
	)};

function updateSwearJar(user, swearCount){

	swearJar[user] += swearCount;
	console.log(swearJar)
}

function getUsernameFromId(id) {
  const user = users.find(user => user.id === id);
  return user ? user.name : "unknown member";
}

function listUsers() {
  return users;
}

function getSwearJar(){
	return swearJar;
}

function getUserSwearCount(user){
	return swearJar[user]
}

module.exports = {
  listUsers,
  updateUsers,
  getUsernameFromId,
  updateSwearJar,
  getSwearJar,
  getUserSwearCount
};
