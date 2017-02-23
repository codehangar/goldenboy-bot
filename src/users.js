let users = [];

function updateUsers(data) {
  users = data.members;
}

function getUsernameFromId(id) {
  const user = users.find(user => user.id === id);
  return user ? user.name : "unknown member";
}

function listUsers() {
  return users;
}

module.exports = {
  listUsers,
  updateUsers,
  getUsernameFromId
};
