exports.data = {
	name: 'Reminder',
	description: 'Removes or lists reminders.',
	group: 'Utilities',
	command: 'reminder',
	syntax: 'reminder [remove/list] [optional:reminder id]',
	author: 'Aris A.',
	permissions: 3,
};

exports.func = async (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Say');
	try{
		
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag}, i got this reminder related error: ${err}`);
	}
};
