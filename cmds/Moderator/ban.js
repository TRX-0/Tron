exports.data = {
	name: 'Ban',
	description: 'Bans a specific user.',
	group: 'Moderator',
	command: 'ban',
	syntax: 'ban [name] [reason]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

exports.func = async (msg, args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		if (args[0]){     
			if (msg.mentions.users.first().id != null){
				let member = msg.mentions.members.first();
				if(member.bannable){ 
					let reason = args.slice(1).join(' ');
					if(!reason){
						return msg.reply('Please indicate a reason for the ban!');
					}
					await member.ban(reason);
					msg.reply(`${member.user.tag} has been banned by ${msg.author.tag} Reason: ${reason}`);
				} else {
					msg.reply('I cannot ban this user! Do they have a higher role? Do I have ban permissions?');
				}
			} else {
				return msg.reply('Please mention a valid member of this server.');
			}
		} else {
			msg.reply('You did not provide a name to ban.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author} I couldn't ban because of : ${err}`);
	}
};
