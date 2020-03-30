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
		const Member = await message.client.findUser.func(args[0], message);
		if (Member == null) {
			return message.reply('User does not exist.');
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