exports.data = {
	name: 'Mute',
	description: 'Mutes a specific user.',
	group: 'Moderator',
	command: 'mute',
	syntax: 'mute [@name] [optional:time] [reason]',
	author: 'Aris A.',
	permissions: 3,
};


//function ParseDate(givenTime){
//	const Values = givenTime.match(/([1-9][smhdwMy])/g);
	

//}

exports.func = async (msg, args) => {
	const OTS = require(`${msg.client.config.folders.models}/otsroles.js`);
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
					return msg.reply('Please indicate a reason for Muting!');
				}
				const ID = await OTS.findOne({
					where: {
						guildId: msg.channel.guild.id
					}
				});
				if (ID) {
					await member.addRole(ID.roleId, reason);
					msg.reply(`${member.user.tag} has been muted by ${msg.author.tag} Reason: ${reason}`);
				} else {
					msg.reply(`Muted Role has not been set in ${msg.guild.name}.`);
				}
			} else {
				return msg.reply('Please mention a valid member of this server.');
			}
		} else {
			msg.reply('You did not provide a name.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} I could not mute because of : ${err}`);
	}
};