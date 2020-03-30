exports.data = {
	name: 'Delete Role',
	description: 'Removes a role from a specific User.',
	group: 'Moderator',
	command: 'delrole',
	syntax: 'delrole [@name/username] [Role]',
	author: 'TRX',
	permissions: 3,
};

exports.func = async (msg, args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args[0] == undefined) {
			return msg.reply('You did not provide a name.');
		}
		if (args[1] == undefined) {
			return msg.reply('You did not provide a Role.');
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
		var RoleName = args.slice(1).join(' ');
		let Role = msg.guild.roles.cache.find(element => element.name.toLowerCase() == RoleName.toLowerCase());

		if (Role == undefined) {
			return msg.reply('Role does not exist!');
		}

		if (Role.comparePositionTo(msg.member.roles.highest) > 0) {
			return msg.reply(`Role \`\`${Role.name}\`\` is higher than your \`\`${msg.member.role.highest.name}\`\` role.`);
		}

		if (!Member.roles.cache.has(Role.id)) {
			return msg.reply(`User does not have the \`\`${Role.name}\`\` role.`);
		}

		await Member.roles.remove(Role).then(() => {
			return msg.reply(`Removed role \`\`${RoleName}\`\` from \`\`${Member.user.username}\`\``);
		}).catch(err => {
			log.error(err);
			return msg.reply(`Role \`\`${Role}\`\` is higher than the Bots Role. Not enough permissions!`);
		});
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} something went wrong: ${err}`);
	}
};