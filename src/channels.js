let channels = [];

function updateChannels(data) {
  channels = data.channels;
}

function getChannelFromId(id) {
  const channel = channels.find(channel => channel.id === id);
  return channel ? channel.name : "unknown channel";
}

function listChannels() {
  return channels;
}

module.exports = {
  listChannels,
  updateChannels,
  getChannelFromId
};
