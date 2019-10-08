exports.data = {
	name: 'Stop',
	command: 'stop',
	description: 'Stops Bot.',
	group: 'System',
	syntax: 'stop',
	author: 'Aris A.',
	permissions: 3
};

exports.func = async (msg, args, bot) => {
	const log = require(`${bot.config.folders.lib}/log.js`)('Stop');
	try {
		return new Promise((resolve, reject) => {
			try {
				msg.channel.send('Stopping all processes and exiting!');
				bot.destroy();
				process.exit();
			} catch (err) {
				log.error(`Error on bot quit: ${err}`);
				reject(err);
			}
		});
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Something went wrong in stop.js: ${err}`);
	}
};
