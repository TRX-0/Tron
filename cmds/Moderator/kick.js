exports.data = {
	name: 'Kick',
	description: 'Kick a specific user.',
	group: 'Moderator',
	command: 'kick',
	syntax: 'kick [name] [reason]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

exports.func = async (msg, args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		if (args[0] == undefined) {
			return msg.reply('You did not provide a name.');
		}
		let Member;
		if (msg.mentions.users.first() != undefined) {
			Member = msg.mentions.members.first();
		}
		else {
			const GuildMembers = await msg.guild.members.cache;
			await GuildMembers.forEach(guildMember => {
				if ((guildMember.user.username.toLowerCase() == args[0].toLowerCase()) || (guildMember.nickname && (guildMember.nickname.toLowerCase() == args[0].toLowerCase()))) {
					Member = guildMember;
				}
			});
			if (Member == undefined) {
				return msg.reply('User does not exist.');
			}
		}
		if (Member.kickable) {
			let reason = args.slice(1).join(' ');
			if (!reason) {
				return msg.reply('Please indicate a reason for kicking!');
			}
			await Member.kick({ reason: reason })
				.then(log.info(`${Member.user.tag} has been banned by ${msg.author.tag}. Reason: ${reason}`))
				.then(msg.reply(`${Member.user.tag} has been kicked by ${msg.author.tag} Reason: ${reason}`));
		} else {
			msg.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author} I couldn't kick because of : ${err}`);
	}
};
