exports.data = {
	name: 'Admin',
	command: 'admin',
	description: 'Adds or Removes a bot administrator.',
	group: 'System',
	syntax: 'admin [add/remove] [name/mention]',
	author: 'Aris A.',
	permissions: 4
};

exports.func = async (msg,args,bot) => {
	const log = require(`${bot.config.folders.lib}/log.js`)('Admin');
	const ProfilesDB = require(`${bot.config.folders.models}/profiles.js`);
	try {
		if(args.lenth != 2){
			if(args[0] == 'add' || args[0] == 'Add' || args[0] == 'Remove' || args[0] == 'remove'){
				if(args[0] == 'add') args[0] = 'Add';
				if(args[0] == 'remove') args[0] = 'Remove';
				let Member;
				if(args[1].includes('@')){
					Member = msg.mentions.members.first();
				} else {
					const Users = await msg.guild.members;
					var Found = false;
					await Users.forEach(user => {
						if ( (user.user.username.toLowerCase() == args[1].toLowerCase()) || ( user.nickname && (user.nickname.toLowerCase() == args[1].toLowerCase()))) {
							Found = true;
							Member = user;
						}
					});
					if (!Found) {
						return msg.reply('User does not exist.');
					}
				}
				const AdminExists = await ProfilesDB.findOne({
					where: {
						discordid: Member.id
					}
				});
				switch (args[0]){
				case 'Add':
					//Add the now found user as an admin
					if (AdminExists && AdminExists.admin == true) {
						return msg.reply('User already an Admin.');
					} else {
						await AdminExists.update({
							admin:true
						});
						log.info(`${msg.author.username} added ${Member.user.username} as an Admin.`);
					}
					msg.reply(`Succesfully added ${Member.user.username} as an Admin!`);
					break;
				case 'Remove':
					if (AdminExists && AdminExists.admin == false) {
						return msg.reply('User is not an Admin.');
					} else {
						await AdminExists.update({
							admin:false
						});
						log.info(`${msg.author.username} removed ${Member.user.username} from Admin.`);
					}
					msg.reply(`Succesfully removed ${Member.user.username} from Admin group!`);
					break;
				}
			}
		} else {
			msg.reply('Wrong arguments');
		}
	} catch (err){
		msg.reply('Something went wrong.');
		log.error(`Something went wrong in admin.js: ${err}`);
	}
};
