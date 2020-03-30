exports.data = {
	name: 'Delete Role',
	description: 'Removes a role from a specific User.',
	group: 'Moderator',
	command: 'delrole',
	syntax: 'delrole [@name/username] [Role]',
	author: 'TRX',
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

		if (!Member.roles.cache.has(Role.id)) {
			return message.reply(`User does not have the \`\`${Role.name}\`\` role.`);
		}

		await Member.roles.remove(Role).then(() => {
			return message.reply(`Removed role \`\`${RoleName}\`\` from \`\`${Member.user.username}\`\``);
		}).catch(err => {
			log.error(err);
			return message.reply(`Role \`\`${Role}\`\` is higher than the Bots Role. Not enough permissions!`);
		});
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag} something went wrong: ${err}`);
	}
};