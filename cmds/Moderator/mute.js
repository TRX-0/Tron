exports.data = {
	name: 'Mute',
	description: 'Mutes a specific user.',
	group: 'Moderator',
	command: 'mute',
	syntax: 'mute [name] [optional:time] [reason]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

//function ParseDate(givenTime){
//	const Values = givenTime.match(/([1-9][smhdwMy])/g);
	

//}

exports.func = async (msg, args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Mute');
	try{
		if (args[0]){    
			if (msg.mentions.users.first().id != null){

				//const time = '1s1m1h1d1w1M1y'; //this is date based
				//const Values = ParseDate(time);
				//log.info(`${Values}`);


				let member = msg.mentions.members.first();
				let reason = args.slice(1).join(' ');
				if(!reason){
					return msg.reply('Please indicate a reason for muting!');
				}
				await member.setMute(true, reason);
				msg.reply(`${member.user.tag} has been muted by ${msg.author.tag} Reason: ${reason}`);
			} else {
				return msg.reply('Please mention a valid member of this server.');
			}
		} else {
			msg.reply('You did not provide a name to ban.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author} I could not mute because of : ${err}`);
	}
};
