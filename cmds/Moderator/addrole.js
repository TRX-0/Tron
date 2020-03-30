exports.data = {
	name: 'AddRole',
	description: 'Adds a role to a specific User.',
	group: 'Moderator',
	command: 'addrole',
	syntax: 'addrole [@name | name] [Role]',
	author: 'TRX',
	revisedBy: 'Sqbika',
	permissions: 3,
};

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args[0] == undefined) {
			return message.reply('You did not provide a name.');
		}
		if (args[1] == undefined) {
			return message.reply('You did not provide a Role.');
		} 
		let Member;
		if (message.mentions.users.first() != undefined) {
			Member = message.mentions.members.first();
		}
		else {
			const GuildMembers = await message.guild.members.cache;
			await GuildMembers.forEach(guildMember => {
				if ((guildMember.user.username.toLowerCase() == args[0].toLowerCase()) || (guildMember.nickname && (guildMember.nickname.toLowerCase() == args[0].toLowerCase()))) {
					Member = guildMember;
				}
			});
			//Member = await message.guild.members.fetch((member) => member.user.username.toLowerCase() == args[0].toLowerCase() || (member.nickname && (member.nickname.toLowerCase() == args[0].toLowerCase())));
			if (Member == undefined) {
				return message.reply('User does not exist.');
			}
		}

		var RoleName = args.slice(1).join(' ');
		let Role = message.guild.roles.cache.find(element => element.name.toLowerCase() == RoleName.toLowerCase());
		if (Role == undefined) {
			return message.reply('Role does not exist!');
		}

		if (Role.comparePositionTo(message.member.roles.highest) > 0) {
			return message.reply(`Role \`\`${Role.name}\`\` is higher than your \`\`${message.member.role.highest.name}\`\` role.`);
		}

		if (Member.roles.cache.has(Role.id)) {
			return message.reply(`User already has the \`\`${Role.name}\`\` role!`);
		}

		await Member.roles.add(Role).then(() => {
			return message.reply(`Added role \`\`${RoleName}\`\` to \`\`${Member.user.username}\`\``);
		}).catch(err => {
			log.error(err);
			return message.reply(`Role \`\`${Role}\`\` is higher than the Bots Role. Not enough permissions!`);
		});
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag} something went wrong: ${err}`);
	}
};