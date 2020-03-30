exports.data = {
	name: 'Ban',
	description: 'Bans a specific user.',
	group: 'Moderator',
	command: 'ban',
	syntax: 'ban [@name/username] [Days of messages to delete] [Reason]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

exports.func = async (msg, args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args[0] == undefined) {
			return msg.reply('You did not provide a name to ban.');
		}
		let Member;
		if (msg.mentions.users.first() != undefined) {
			Member = msg.mentions.members.first();
		} else {
			const GuildMembers = await msg.guild.members.cache;
			await GuildMembers.forEach(guildMember => {
				if ((guildMember.user.username.toLowerCase() == args[0].toLowerCase()) || (guildMember.nickname && (guildMember.nickname.toLowerCase() == args[0].toLowerCase()))) {
					Member = guildMember;
				}
			});
			if (Member == undefined) {
				return msg.reply('User does not exist.');
			}
			// Todo: Add days of messages to delete
			if (Member.bannable) {
				let reason = args.slice(1).join(' ');
				if (!reason) {
					return msg.reply('Please indicate a reason for the ban!');
				}
				await Member.ban({ reason: reason })
					.then(log.info(`${Member.user.tag} has been banned by ${msg.author.tag}. Reason: ${reason}`))
					.then(msg.reply(`${Member.user.tag} has been banned by ${msg.author.tag} Reason: ${reason}`));
			} else {
				msg.reply('I cannot ban this user! Do they have a higher role? Do I have ban permissions?');
			}
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author} I couldn't ban because of : ${err}`);
	}
};
