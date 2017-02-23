const funPrewords = ["stabilize ", "for ", "kill ", "reward ", "praise ", "scold ", "punish ", "hey ", "hello ", "fuck you "];
const statusPrewords = ["sleep ", "silence ", "speak ", "status "]
const allPrewords = funPrewords.concat(statusPrewords); // to be expanded

module.exports = {
  funPrewords: funPrewords,
  statusPrewords: statusPrewords,
  allPrewords: allPrewords
};
