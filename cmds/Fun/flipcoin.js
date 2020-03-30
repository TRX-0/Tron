exports.data = {
	name: 'Flipcoin',
	description: 'Flips a coin.',
	group: 'Fun',
	command: 'flipcoin',
	syntax: 'flipcoin',
	author: 'TRX',
	permissions: 1,
};

const Discord = require('discord.js');

exports.func = (message) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		const random = Math.random();
		switch (true) {
		case (random > 0.5):{
			const embed = new Discord.MessageEmbed()
				.setColor(835718)
				.addField('Flip Result:', 'Heads');
			message.channel.send('', { embed: embed });
			break;
		}
		case (random < 0.5): {
			const embed = new Discord.MessageEmbed()
				.setColor(835718)
				.addField('Flip Result:', 'Tails');
			message.channel.send('', { embed: embed });
			break;
		}
		default: {
			const embed = new Discord.MessageEmbed()
				.setColor(835718)
				.addField('Flip Result:', 'Your coin just landed straight up...');
			message.channel.send('', { embed: embed });
			break;
		}
		}
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag}, i could not flip a coin: ${err}`);
	}
};
