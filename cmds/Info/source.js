exports.data = {
	name: 'Source',
	command: 'source',
	description: 'Source code of the Bot.',
	group: 'Info',
	syntax: 'source',
	author: 'TRX',
	permissions: 0
};

exports.func = async (message) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		message.channel.send('https://github.com/TRX-0/Tron');
	} catch (err){
		message.reply('Something went wrong.');
		log.error(`Something went wrong: ${err}`);
	}
};
