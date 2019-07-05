exports.data = {
	name: 'AddRole',
	description: 'Adds a role to a specific User.',
	group: 'Moderator',
	command: 'addrole',
	syntax: 'addrole [@name | name] [Role]',
	author: 'Aris A.',
	revisedBy: 'Sqbika',
	permissions: 3,
};

exports.func = async (msg, args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('AddRole');
	try {
		if (args[0] == undefined) return msg.reply('You did not provide a name.');
		if (args[1] == undefined) return msg.reply('You did not provide a Role.');
		let Member;
		if  (msg.mentions.users.first() != undefined) Member = msg.mentions.members.first();
		else {
			Member = msg.guild.members.find((user) => user.user.username.toLowerCase() == args[0].toLowerCase() || (user.nickname && (user.nickname.toLowerCase() == args[0].toLowerCase())));
			if (Member == undefined) return msg.reply('User does not exist.');
		}
		var RoleName = args.slice(1).join(' ');
		let Role = msg.guild.roles.find(element => element.name.toLowerCase() == RoleName.toLowerCase());
		if (Role == undefined) return msg.reply('Role does not exist!');
		if (Role.comparePositionTo(msg.member.highestRole) > 0) return msg.reply(`Role \`\`${Role.name}\`\` is higher than your \`\`${msg.member.highestRole.name}\`\` role.`);
		if (Member.roles.has(Role.id)) return msg.reply(`User already has the \`\`${Role.name}\`\` role!`);
		await Member.addRole(Role).then(() => {
			return msg.reply(`Added role \`\`${RoleName}\`\` to \`\`${Member.user.username}\`\``);
		}).catch(err => {
			log.error(err);
			return msg.reply(`Role \`\`${Role}\`\` is higher than the Bots Role. Not enough permissions!`);
		});
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} something went wrong: ${err}`);
	}
};