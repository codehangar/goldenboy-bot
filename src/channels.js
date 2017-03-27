let channels = [];
let ims = []

function updateChannels(data) {
  channels = data.channels;
}

function updateIMs(data) {
	ims = data.ims;
}

function getIMfromUID(uid) {
	console.log(uid);
	const im = ims.find(im => im.user === uid);
	return im ? im.id : "unknown IM channel";
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
  getChannelFromId,
  updateIMs,
  getIMfromUID
};
