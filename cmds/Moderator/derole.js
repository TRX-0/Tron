exports.data = {
	name: 'DeleteRole',
	description: 'Removes a role from a specific User.',
	group: 'Moderator',
	command: 'derole',
	syntax: 'derole [@name | name] [Role]',
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
				let Role;
				msg.guild.roles.forEach(element => {
					if(element.name.toLowerCase() == RoleName.toLowerCase()){
						Role = element;
					}
				});
				if (Role) {
					if (Role.comparePositionTo(msg.member.highestRole) <= 0){
						if (Member.roles.has(Role.id)) {
							let Error = false;
							await Member.removeRole(Role).catch(err => {
								log.error(err);
								Error = true;
								msg.reply(`Role ${Role} is higher than the Bots Role. Not enough permissions!`);
							});
							if(Error == false){
								msg.reply(`Removed role \`\`${RoleName}\`\` from \`\`${Member}\`\``);
							}
						} else {
							msg.reply(`User does not have the \`\`${Role.name}\`\` role.`);
						}
					} else {
						msg.reply(`Role \`\`${Role.name}\`\` is higher than your \`\`${msg.member.highestRole.name}\`\` role.`);
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