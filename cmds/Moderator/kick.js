exports.data = {
	name: 'Kick',
	description: 'Kick a specific user.',
	group: 'Moderator',
	command: 'kick',
	syntax: 'kick [name] [reason]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

exports.func = async (msg, args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Kick');
	try{
		if (args[0]){     
			if (msg.mentions.users.first().id != null){
				let member = msg.mentions.members.first();
				if(member.kickable){ 
					let reason = args.slice(1).join(' ');
					if(!reason){
						return msg.reply('Please indicate a reason for kicking!');
					}
					await member.kick(reason);
					msg.reply(`${member.user.tag} has been kicked by ${msg.author.tag} Reason: ${reason}`);
				} else {
					msg.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?');
				}
			} else {
				return msg.reply('Please mention a valid member of this server');
			}
		} else {
			msg.reply('You did not provide a name.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author} I couldn't kick because of : ${err}`);
	}
};
