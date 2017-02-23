let users = {};

function updateUsers(data) {
  users = data;
  for (m in users.members) {
    //console.log(users.members[m].id);

  }
}

function getUsernameFromId(id) {
  for (var m in users.members) {
    //console.log(users.members[m].id);
    if (users.members[m].id == id) {
      return users.members[m].name;
    }
  }
  return "unknown member";
}

module.exports = {
  updateUsers,
  getUsernameFromId
};
