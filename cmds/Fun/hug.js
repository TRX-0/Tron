exports.data = {
	name: 'Hug',
	description: 'Hugs specified user.',
	group: 'Fun',
	command: 'hug',
	syntax: 'hug [@user]',
	author: 'TRX',
	permissions: 1,
};

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
		await message.delete();
		await message.channel.send(`${Member} here is a hug to feel better! `, {
			embed: {
				color: 0xff8000,
				image: {
					url: 'https://media.giphy.com/media/3M4NpbLCTxBqU/giphy.gif'
				}
			}
		});
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag}, i could not hug due to: ${err}`);
	}
};
