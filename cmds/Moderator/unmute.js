exports.data = {
	name: 'Unmute',
	description: 'Unmutes a specific user.',
	group: 'Moderator',
	command: 'unmute',
	syntax: 'unmute [@name]',
	author: 'Aris A.',
	permissions: 3,
};

exports.func = async (msg, args) => {
	const OTS = require(`${msg.client.config.folders.models}/otsroles.js`);
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Mute');
	try{
		if (args[0]){    
			if (msg.mentions.users.first().id != null){
				let member = msg.mentions.members.first();
				const ID = await OTS.findOne({
					where: {
						guildId: msg.channel.guild.id
					}
				});
				if (ID) {
					await member.removeRole(ID.roleId);
					msg.reply(`${member.user.tag} has been un-OTS'ed by ${msg.author.tag}`);
				} else {
					msg.reply(`OTS Role has not been set in ${msg.guild.name}.`);
				}
			} else {
				return msg.reply('Please mention a valid member of this server.');
			}
		} else {
			msg.reply('You did not provide a name.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} I could not remove the OTS because of : ${err}`);
	}
};