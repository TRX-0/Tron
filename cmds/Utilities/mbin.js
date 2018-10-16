exports.data = {
	name: 'mbin',
	description: 'Gives a link to the latest MBIN Version.',
	group: 'Utilities',
	command: 'mbin',
	syntax: 'mbin',
	author: 'Aris A.',
	permissions: 3,
};

exports.func = async (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Say');
	try{
		msg.reply('Here is the latest Mbin Compiler: https://github.com/monkeyman192/MBINCompiler/releases');
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag}, i could not provide a link to mbin due to: ${err}`);
	}
};
