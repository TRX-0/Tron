exports.data = {
	name: 'Unmute',
	description: 'Un-mutes the voice activity of a member.',
	group: 'Moderator',
	command: 'unmute',
	syntax: 'unmute [name]',
	author: 'Aris A.',
	permissions: 3,
};

exports.func = async (msg, args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Mute');
	try{		
		if (args[0]){
			if (msg.mentions.users.first().id != null){
				let member = msg.mentions.members.first();
				await member.setMute(false);
				msg.reply(`${member.user.tag} has been un-muted by ${msg.author.tag}`);
			} else {
				return msg.reply('Please mention a valid member of this server.');
			}
		} else {
			msg.reply('You did not provide a name.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author} I could not un-mute because of : ${err}`);
	}
};
