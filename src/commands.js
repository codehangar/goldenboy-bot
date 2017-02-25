const trelloCommands = ["idea:", "blog post:", "ch todo:"];
const togglCommands = ["toggl:"];
const noteCommands = ["save meeting notes:", "print meeting notes:", "clear meeting notes:", "good news:", "customer headline:", "employee headline:"];
const helpCommands = ["help:", "hello:"];
const statusCommands = ["sleep:", "speak:", "silence:", "status:", "uptime:"];
const funCommands = ["kill:", "punish:", "reward:"];
const allCommands = trelloCommands.concat(togglCommands).concat(noteCommands).concat(helpCommands).concat(funCommands).concat(statusCommands);

module.exports = {
  trelloCommands,
  togglCommands,
  noteCommands,
  helpCommands,
  statusCommands,
  funCommands,
  allCommands
};
