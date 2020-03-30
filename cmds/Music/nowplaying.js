exports.data = {
	name: 'Now Playing',
	description: 'Shows what song is currently playing.',
	group: 'Music',
	command: 'nowplaying',
	syntax: 'nowplaying',
	author: 'TRX',
	permissions: 2,
};

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`);
};