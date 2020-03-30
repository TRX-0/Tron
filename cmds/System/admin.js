exports.data = {
	name: 'Admin',
	command: 'admin',
	description: 'Adds or Removes a bot administrator.',
	group: 'System',
	syntax: 'admin [add/remove] [name/mention]',
	author: 'TRX',
	permissions: 5
};

exports.func = async (msg, args, bot) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	const ProfilesDB = require(`${bot.config.folders.models}/profiles.js`);
	try {
		if (args[0] == undefined || args[1] == undefined) {
			return msg.reply('Too few arguments!');
		}
		if (args[0].toLowerCase() != 'add' && args[0].toLowerCase() != 'remove') {
			return msg.reply(`Wrong option \`\`${args[0]}\`\``);
		}

		let Member;
		if (msg.mentions.users.first() != undefined) {
			Member = msg.mentions.members.first();
		}
		else {
			const GuildMembers = await msg.guild.members.cache;
			await GuildMembers.forEach(guildMember => {
				if ((guildMember.user.username.toLowerCase() == args[1].toLowerCase()) || (guildMember.nickname && (guildMember.nickname.toLowerCase() == args[1].toLowerCase()))) {
					Member = guildMember;
				}
			});
			if (Member == undefined) {
				return msg.reply('User does not exist.');
			}
		}
		
		const AdminExists = await ProfilesDB.findOne({
			where: {
				discordid: Member.id
			}
		});

		//Add the now found user as an admin
		switch (args[0].toLowerCase()) {
			case 'add':
				if (AdminExists && AdminExists.admin == true) {
					return msg.reply('User already an Admin.');
				} else {
					await AdminExists.update({
						admin: true
					});
					log.info(`${msg.author.username} added ${Member.user.username} as an Admin.`);
				}
				msg.reply(`Succesfully added ${Member.user.username} as an Admin!`);
				break;
			case 'remove':
				if (AdminExists && AdminExists.admin == false) {
					return msg.reply('User is not an Admin.');
				} else {
					await AdminExists.update({
						admin: false
					});
					log.info(`${msg.author.username} removed ${Member.user.username} from Admin.`);
				}
				msg.reply(`Succesfully removed ${Member.user.username} from Admin group!`);
			default:
				break;
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Something went wrong in admin.js: ${err}`);
	}
};
