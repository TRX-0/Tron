exports.data = {
	name: 'FlipCoin',
	description: 'Flips a coin.',
	group: 'Fun',
	command: 'flipcoin',
	syntax: 'flipcoin',
	author: 'Aris A.',
	permissions: 1,
	anywhere: false
};

const Discord = require('discord.js');

exports.func = (msg) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		const random = Math.random();
		switch (true) {
		case (random > 0.5):{
			const embed = new Discord.RichEmbed()
				.setColor(835718)
				.addField('Flip Result:', 'Heads');
			msg.channel.send(embed);
			break;
		}
		case (random < 0.5): {
			const embed = new Discord.RichEmbed()
				.setColor(835718)
				.addField('Flip Result:', 'Tails');
			msg.channel.send(embed);
			break;
		}
		default: {
			const embed = new Discord.RichEmbed()
				.setColor(835718)
				.addField('Flip Result:', 'Your coin just landed straight up...');
			msg.channel.send(embed);
			break;
		}
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag}, i could not flip a coin: ${err}`);
	}
};
