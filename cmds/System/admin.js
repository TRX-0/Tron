exports.data = {
	name: 'Admin',
	command: 'admin',
	description: 'Adds or Removes a bot administrator.',
	group: 'System',
	syntax: 'admin [add/remove] [name/mention]',
	author: 'TRX',
	permissions: 5
};

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	const ProfilesDB = require(`${message.client.config.folders.models}/profiles.js`);
	try {
		if (args[0] == undefined || args[1] == undefined) {
			return message.reply('Too few arguments!');
		}
		if (args[0].toLowerCase() != 'add' && args[0].toLowerCase() != 'remove') {
			return message.reply(`Wrong option \`\`${args[0]}\`\``);
		}
		const Member = await message.client.findUser.func(args[1], message);
		if (Member == null) {
			return message.reply('User does not exist.');
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
					return message.reply('User already an Admin.');
				} else {
					await AdminExists.update({
						admin: true
					});
					log.info(`${message.author.username} added ${Member.user.username} as an Admin.`);
				}
				message.reply(`Succesfully added ${Member.user.username} as an Admin!`);
				break;
			case 'remove':
				if (AdminExists && AdminExists.admin == false) {
					return message.reply('User is not an Admin.');
				} else {
					await AdminExists.update({
						admin: false
					});
					log.info(`${message.author.username} removed ${Member.user.username} from Admin.`);
				}
				message.reply(`Succesfully removed ${Member.user.username} from Admin group!`);
			default:
				break;
		}
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Something went wrong in admin.js: ${err}`);
	}
};
