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
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		if (args[0]){
			if (args[0].includes('@')){
				if (msg.mentions.users.first().id != null){
					let Member = msg.mentions.members.first();
					if(Member.kickable){ 
						let reason = args.slice(1).join(' ');
						if(!reason){
							return msg.reply('Please indicate a reason for kicking!');
						}
						await Member.kick(reason);
						msg.reply(`${Member.user.tag} has been kicked by ${msg.author.tag} Reason: ${reason}`);
					} else {
						msg.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?');
					}
				} else {
					return msg.reply('Please mention a valid member of this server');
				}
			} else {
				const Users = await msg.guild.members;
				var Found = false;
				let Member;
				await Users.forEach(user => {
					if ( (user.user.username.toLowerCase() == args[0].toLowerCase()) || ( user.nickname && (user.nickname.toLowerCase() == args[0].toLowerCase()))) {
						Found = true;
						Member = user;
					}
				});
				if (Found == true) {
					if(Member.kickable){ 
						let reason = args.slice(1).join(' ');
						if(!reason){
							return msg.reply('Please indicate a reason for kicking!');
						}
						await Member.kick(reason);
						msg.reply(`${Member.user.tag} has been kicked by ${msg.author.tag} Reason: ${reason}`);
					} else {
						msg.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?');
					}
				} else {
					msg.channel.send('User does not exist.');
				}
			}
		} else {
			msg.reply('You did not provide a name.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author} I couldn't kick because of : ${err}`);
	}
};
