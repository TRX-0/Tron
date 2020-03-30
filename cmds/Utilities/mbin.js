exports.data = {
	name: 'mbin',
	description: 'Gives a link to the latest MBIN Version.',
	group: 'Utilities',
	command: 'mbin',
	syntax: 'mbin',
	author: 'TRX',
	permissions: 1,
};

exports.func = async (message) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		message.reply('Here is the latest Mbin Compiler: https://github.com/monkeyman192/MBINCompiler/releases');
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag}, i could not provide a link to mbin due to: ${err}`);
	}
};
