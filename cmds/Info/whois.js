exports.data = {
	name: 'Whois',
	description: 'Gets information about a user.',
	group: 'Info',
	command: 'whois',
	syntax: 'whois [user mention]',
	author: 'Aris A.',
	permissions: 1,
	anywhere: false
};

const Discord = require('discord.js');

exports.func = async (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		if (args[0]){
			let User;
			if (args[0].includes('@')){
				User = msg.mentions.members.first();
			} else {
				const Users = await msg.guild.members;
				await Users.forEach(user => {
					if ( (user.user.username.toLowerCase() == args[0].toLowerCase()) || ( user.nickname && (user.nickname.toLowerCase() == args[0].toLowerCase()))) {
						User = user;
					}
				});
			}
			if (User != null) {
				const embed = new Discord.RichEmbed()
					.setAuthor(`Information about ${User.user.tag}`,User.user.avatarURL)
					.setColor(0xff8000)
					.setThumbnail(User.user.avatarURL)
					.addField('Username:', User.user.username, true)
					.addField('Discriminator:', User.user.discriminator, true)
					.addField('Discord ID:', User.user.id, false)
					.addField('Status', User.user.presence.status, false)
					.addField('Created at:', User.user.createdAt, false)
					.addField('Joined at:', msg.guild.members.get(User.user.id).joinedAt)
					.addField('Current roles:', msg.guild.members.get(User.user.id).roles.array().sort((a,b) => b.position - a.position).join(' – '), false);
				msg.channel.send(embed);
			} else {
				msg.channel.send('User does not exist.');
			}
		} else {
			msg.reply('You did not provide a User.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag}, someting went wrong: ${err}`);
	}
};
