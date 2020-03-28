exports.data = {
	name: 'Source',
	command: 'source',
	description: 'Source code of the Bot.',
	group: 'Info',
	syntax: 'source',
	author: 'Aris A.',
	permissions: 1
};

exports.func = async (msg) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		msg.channel.send('https://github.com/A-G-Angelopoulos/Tron');
	} catch (err){
		msg.reply('Something went wrong.');
		log.error(`Something went wrong: ${err}`);
	}
};
