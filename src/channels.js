let channels = {};

function updateChannels(data) {
  channels = data;
  for (const m in channels.channels) {
    //console.log(channels.channels[m].name)
  }
}

function getChannelFromId(id) {
  for (const c in channels.channels) {
    if (channels.channels[c].id == id) {
      return channels.channels[c].name;
    }
  }
  return "unknown channel";
}

module.exports = {
  updateChannels,
  getChannelFromId
};
