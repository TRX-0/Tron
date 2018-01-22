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



exports.func = (msg) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('FlipCoin');
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
