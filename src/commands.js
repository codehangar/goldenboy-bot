const trelloCommands = ["idea:", "blog post:", "ch todo:"];
const noteCommands = ["save meeting notes:", "print meeting notes:", "clear meeting notes:", "good news:", "customer headline:", "employee headline:"];
const helpCommands = ["help:", "hello:", "status:"];
const statusCommands = ["sleep:", "speak:", "silence:", "status:"];
const funCommands = ["kill goldenboy:", "punish:", "reward:"];
const allCommands = trelloCommands.concat(noteCommands).concat(helpCommands).concat(funCommands).concat(statusCommands);

module.exports = {
  trelloCommands: trelloCommands,
  noteCommands: noteCommands,
  helpCommands: helpCommands,
  statusCommands: statusCommands,
  funCommands: funCommands,
  allCommands: allCommands
};
