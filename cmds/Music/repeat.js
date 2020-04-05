exports.data = {
	name: 'Repeat',
	description: 'Sets the song or the list to repeat. 0:Off, 1:List, 2:Song.',
	group: 'Music',
	command: 'repeat',
	syntax: 'repeat [0-2]',
	author: 'TRX',
	permissions: 2,
};

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	const serverQueue = message.client.queue.get(message.guild.id);
	if (!message.member.voice.channel) {
		return message.channel.send('You have to be in a voice channel to set the music to replay!');
	}
	if (!serverQueue) {
		return message.channel.send('There is no song currently playing!');
	}
	if (args[0] == undefined) {
		return message.reply('You did not provide a value.');
	}
	switch (args[0]) {
		case '0':
			serverQueue.replay = 0;
			message.reply('Repeat off.')
			break;
		case '1':
			serverQueue.replay = 1;
			message.reply(':repeat_one:');
			break;
		case '2':
			serverQueue.replay = 2;
			message.reply(':repeat:');
			break;
		default:
			message.reply('Value must be between 0 and 2.');
			break;
	}

};