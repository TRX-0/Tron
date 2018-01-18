exports.data = {
	name: 'FlipCoin',
	description: 'Flips a coin.',
	group: 'fun',
	command: 'flipcoin',
	syntax: 'flipcoin',
	author: 'Aris A.',
	permissions: 1,
	anywhere: false
};

const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

exports.func = async (msg) => {
	try{
		const random = Math.random();
		switch (true) {
		case (random > 0.5):{
			msg.channel.send('', {embed: {
				color: 835718,
				fields: [
					{
						'name': 'Flip Result',
						'value': 'Heads'
					}
				]
			}});
			break;
		}
		case (random < 0.5): {
			msg.channel.send('', {embed: {
				color: 835718,
				fields: [
					{
						'name': 'Flip Result',
						'value': 'Tails'
					}
				]
			}});
			break;
		}
		default: {
			msg.channel.send('', {embed: {
				color: 835718,
				fields: [
					{
						'name': 'Flip Result',
						'value': 'Your coin just landed straight up...'
					}
				]
			}});
			break;
		}
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag}, i could not flip a coin: ${err}`);
	}
};
