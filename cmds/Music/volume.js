exports.data = {
	name: 'Volume',
	description: 'Changes the music volume.',
	group: 'Music',
	command: 'volume',
	syntax: 'volume [number]',
	author: 'TRX',
	permissions: 2,
};

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args.length < 1) {
			return msg.reply('You did not provide any arguments.');
		}
		const volume = parseInt(args[0]);
		if (volume == NaN) {
			return msg.reply('The volume must be a valid number.');
		}
		if (volume < '1' || volume > '200') {
			return msg.reply('Volume must be between 10 and 200.');
		}
		if (!message.member.voice.channel) {
			return message.channel.send('You have to be in a voice channel to stop the music!');
		}
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) {
			return message.channel.send('There is no song currently playing!');
		}
		serverQueue.volume = args[0];
		volume = args[0] / 100;
		serverQueue.connection.dispatcher.setVolume(volume);
		message.channel.send(`Current volume is: ${args[0]}%`);
	} catch (err) {
		message.reply(`Something went wrong: ${err}`);
	}
};