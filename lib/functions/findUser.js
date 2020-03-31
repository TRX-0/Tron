exports.func = async (name, message) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)('Find User');
	try {
		let Member;
		if (message.mentions.users.first() != undefined) {
			Member = message.mentions.members.first();
			return Member;
		}
		else {
			const GuildMembers = await message.guild.members.cache;
			await GuildMembers.forEach(guildMember => {
				if ((guildMember.user.username.toLowerCase() == name.toLowerCase()) || (guildMember.nickname && (guildMember.nickname.toLowerCase() == name.toLowerCase()))) {
					Member = guildMember;
				}
			});
			if (Member == undefined) {
				return null;
			} else {
				return Member;
			}
		}
	} catch (err) {
		log.error(`Error on finding user: ${err}`);
		reject(err);
	}
};