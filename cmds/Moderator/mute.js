exports.data = {
	name: 'Mute',
	description: 'Mutes a specific user.',
	group: 'Moderator',
	command: 'mute',
	syntax: 'mute [@name] [optional:reason]',
	author: 'Aris A.',
	permissions: 3,
};

//function ParseDate(givenTime){
//	const Values = givenTime.match(/([1-9][smhdwMy])/g);
//}

exports.func = async (msg, args) => {
	const OTS = require(`${msg.client.config.folders.models}/mute.js`);
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Mute');
	try{
		if (args[0]){
			let Member;
			if (args[0].includes('@')){
				if (msg.mentions.users.first() != null){
					//const time = '1s1m1h1d1w1M1y'; //this is date based
					//const Values = ParseDate(time);
					//log.info(`${Values}`);
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
					return msg.channel.send('User does not exist.');
				}
			}
			let reason = args.slice(1).join(' ');
			const ID = await OTS.findOne({
				where: {
					guildId: msg.channel.guild.id
				}
			});
			if (ID) {
				const muteappeal = msg.guild.channels.get(ID.mutedChannelId);
				await Member.addRole(ID.roleId, reason);
				await muteappeal.send(`${Member} You have been muted. You can appeal the mute here.`);
				msg.reply(`${Member.user.tag} has been muted by ${msg.author.tag}`);
			} else {
				msg.reply(`Muted Role has not been set in ${msg.guild.name}.`);
			}
		} else {
			msg.reply('You did not provide a name.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} I could not mute because of : ${err}`);
	}
};