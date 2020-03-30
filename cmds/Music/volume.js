exports.data = {
	name: 'Skip',
	description: 'Skips the current song.',
	group: 'Music',
	command: 'skip',
	syntax: 'skip',
	author: 'TRX',
	permissions: 2,
};

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	if (args[0] == undefined) {
		return msg.reply('You did not provide any arguments.');
	}

	const serverQueue = message.client.queue.get(message.guild.id);
	if (!message.member.voice.channel) {
		return message.channel.send('You have to be in a voice channel to stop the music!');
	}
	if (!serverQueue) {
		return message.channel.send('There is no song currently playing!');
	}
	const volume = args[0] / 100;
	serverQueue.volume = volume;
	serverQueue.connection.dispatcher.setVolume(volume);
	message.channel.send(`Current volume is: ${args[0]}%`);
};