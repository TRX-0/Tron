exports.data = {
	name: 'Dogs',
	description: 'Gets a random dog picture.',
	group: 'Fun',
	command: 'dogs',
	syntax: 'dogs',
	author: 'TRX',
	permissions: 1,
};

const snekfetch = require('snekfetch');
const Discord = require('discord.js');

exports.func = async (message) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		const Message = await message.channel.send('Getting pictures of cute puppies...');
		const { body } = await snekfetch.get('https://dog.ceo/api/breeds/image/random');
		const embed = new Discord.MessageEmbed()
			.setTitle('Here is your dog image!')
			.setImage(body.message)
			.setColor('ORANGE');
		return Message.edit({ embed });
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag}, someting went wrong: ${err}`);
	}
};
