exports.data = {
	name: 'Kick',
	description: 'Kick a specific user.',
	group: 'Moderator',
	command: 'kick',
	syntax: 'kick [name] [reason]',
	author: 'TRX',
	permissions: 3,
};

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		if (args[0] == undefined) {
			return message.reply('You did not provide a name.');
		}
		const Member = await message.client.findUser.func(args[0], message);
		if (Member == null) {
			return message.reply('User does not exist.');
		}
		if (Member.kickable) {
			let reason = args.slice(1).join(' ');
			if (!reason) {
				return message.reply('Please indicate a reason for kicking!');
			}
			await Member.kick({ reason: reason })
				.then(log.info(`${Member.user.tag} has been banned by ${message.author.tag}. Reason: ${reason}`))
				.then(message.reply(`${Member.user.tag} has been kicked by ${message.author.tag} Reason: ${reason}`));
		} else {
			message.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?');
		}
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author} I couldn't kick because of : ${err}`);
	}
};
