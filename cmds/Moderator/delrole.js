exports.data = {
	name: 'DeleteRole',
	description: 'Removes a role from a specific User.',
	group: 'Moderator',
	command: 'delrole',
	syntax: 'delrole [@name | name] [Role]',
	author: 'Aris A.',
	permissions: 3,
};

exports.func = async (msg, args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('DeleteRole');
	try{
		if (args[0]){
			if (args[1]){
				let Member;
				if (args[0].includes('@')){
					if (msg.mentions.users.first() != null){
						Member = msg.mentions.members.first();
					} else {
						return msg.reply('Please mention a valid member of this server.');
					}
				} else {
					const Users = await msg.guild.members;
					var Found = false;
					await Users.forEach(user => {
						if ( (user.user.username.toLowerCase() == args[0].toLowerCase()) || ( user.nickname && (user.nickname.toLowerCase() == args[0].toLowerCase()))) {
							Found = true;
							Member = user;
						}
					});
					if (!Found) {
						return msg.reply('User does not exist.');
					}
				}
				var RoleName = args[1];
				if (args.length > 2){
					for (var i = 2; i < args.length; i++) {
						RoleName = RoleName + ' ' + args[i];
					}
				}
				log.info(RoleName);
				let Role = msg.guild.roles.find('name', RoleName);
				if (Role) {
					if (Member.roles.has(Role.id)) {
						Member.removeRole(Role).catch(err => {
							log.error(err);
							msg.reply('You do not have enough permissions!');
						});
						msg.reply(`Removed role \`\`${RoleName}\`\` from \`\`${args[0]}\`\``);
					} else {
						msg.reply('User does not have this role.');
					}
				} else {
					return msg.reply('Role does not exist!');
				}
			} else {
				msg.reply('You did not provide a Role.');
			}
		} else {
			msg.reply('You did not provide a name.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} something went wrong: ${err}`);
	}
};