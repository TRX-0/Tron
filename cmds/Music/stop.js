exports.data = {
	name: 'Stop',
	description: 'Stops playing songs.',
	group: 'Music',
	command: 'stop',
	syntax: 'stop',
	author: 'TRX',
	permissions: 2,
};

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	const queue = message.client.queue;
	const serverQueue = queue.get(message.guild.id);
	if (!message.member.voice.channel) {
		return message.channel.send('You have to be in a voice channel to stop the music!');
	}
	if (queue) {
		if (serverQueue){
			serverQueue.voiceChannel.leave();
		}
		queue.delete(message.guild.id);
	}
	if (queue.size == 0) {
		message.client.user.setPresence({ game: null });
	}
};