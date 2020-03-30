exports.data = {
	name: 'Activity',
	command: 'activity',
	description: 'Change bot activity.',
	group: 'Utilities',
	syntax: 'activity [playing/streaming/listening/watching] [activity]',
	author: 'TRX',
	permissions: 4
};

exports.func = async (message, args, client) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args[0] == undefined || args[1] == undefined) {
			return message.reply('Not enough arguments.');
		}
		if (args[0].toLowerCase() != "playing" && args[0].toLowerCase() != "streaming" && args[0].toLowerCase() != "listening" && args[0].toLowerCase() != "watching") {
			return message.reply('Activity type must be [playing/streaming/listening/watching].');
		}
		var activity = args.slice(1).join(' ');
		client.user.setActivity( activity , { type : args[0].toUpperCase() });
		message.channel.send('Activity successfully set!');
		log.info(`${message.author.tag} set tron's activity.`);
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag} unable to set status due to ${err}`);
	}
};
