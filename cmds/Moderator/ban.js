exports.data = {
	name: 'Ban',
	description: 'Bans a specific user.',
	group: 'Moderator',
	command: 'ban',
	syntax: 'ban [@name/username] [Reason]',
	author: 'TRX',
	permissions: 3,
};

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args[0] == undefined) {
			return message.reply('You did not provide a name to ban.');
		}
		const Member = await message.client.findUser.func(args[0], message);
		if (Member == null) {
			return message.reply('User does not exist.');
		}
		// Todo: Add days of messages to delete
		if (Member.bannable) {
			let reason = args.slice(1).join(' ');
			if (!reason) {
				return message.reply('Please indicate a reason for the ban!');
			}
			await Member.ban({ reason: reason })
				.then(log.info(`${Member.user.tag} has been banned by ${message.author.tag}. Reason: ${reason}`))
				.then(message.reply(`${Member.user.tag} has been banned by ${message.author.tag} Reason: ${reason}`));
		} else {
			message.reply('I cannot ban this user! Do they have a higher role? Do I have ban permissions?');
		}
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author} I couldn't ban because of : ${err}`);
	}
};
