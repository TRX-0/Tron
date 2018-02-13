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
	const OTS = require(`${msg.client.config.folders.models}/mute.js`);
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Unmute');
	try{
		if (args[0]){    
			if (msg.mentions.users.first() != null){
				let member = msg.mentions.members.first();
				const ID = await OTS.findOne({
					where: {
						guildId: msg.channel.guild.id
					}
				});
				if (ID) {
					const botspam = msg.guild.channels.get(ID.botspamChannelId);
					await member.removeRole(ID.roleId);
					await botspam.send(`${member} You have been unmuted.`);
					msg.reply(`${member.user.tag} has been unmuted by ${msg.author.tag}`);
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
		log.error(`Sorry ${msg.author.tag} I could not remove the mute because of : ${err}`);
	}
};