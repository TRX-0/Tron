exports.data = {
	name: 'Activity',
	command: 'activity',
	description: 'Change bot activity.',
	group: 'Utilities',
	syntax: 'activity [playing/streaming/listening/watching] [activity]',
	author: 'TRX',
	permissions: 4
};

exports.func = async (msg, args, client) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args[0] == undefined || args[1] == undefined) {
			return msg.reply('Not enough arguments.');
		}
		if (args[0].toLowerCase() != "playing" && args[0].toLowerCase() != "streaming" && args[0].toLowerCase() != "listening" && args[0].toLowerCase() != "watching") {
			return msg.reply('Activity type must be [playing/streaming/listening/watching].');
		}
		var activity = args.slice(1).join(' ');
		client.user.setActivity( activity , { type : args[0].toUpperCase() });
		msg.channel.send('Activity successfully set!');
		log.info(`${msg.author.tag} set tron's activity.`);
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} unable to set status due to ${err}`);
	}
};
