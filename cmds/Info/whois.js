exports.data = {
	name: 'Whois',
	description: 'Gets information about a user.',
	group: 'Info',
	command: 'whois',
	syntax: 'whois [@user/username]',
	author: 'TRX',
	permissions: 2,
};

const Discord = require('discord.js');

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args[0] == undefined) {
			return message.reply('You did not provide a name.');
		}
		const Member = await message.client.findUser.func(args[0], message);
		if (Member == null) {
			return message.reply('User does not exist.');
		}
		const embed = new Discord.MessageEmbed()
			.setAuthor(`Information about ${Member.user.tag}`, Member.user.avatarURL())
			.setColor(0xff8000)
			.setThumbnail(Member.user.avatarURL())
			.addField('Username:', Member.user.username, true)
			.addField('Discriminator:', Member.user.discriminator, true)
			.addField('Discord ID:', Member.user.id, false)
			.addField('Status', Member.user.presence.status, false)
			.addField('Created at:', Member.user.createdAt, false)
			.addField('Joined at:', Member.joinedAt)
			.addField('Current roles:', Member.roles.cache.map(role => role.name).sort((a, b) => b.position - a.position).join(' - '), false);
		message.channel.send('', { embed: embed });
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag}, someting went wrong: ${err}`);
	}
};
