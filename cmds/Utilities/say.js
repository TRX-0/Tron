exports.data = {
	name: 'Say',
	description: 'Makes Tron say something.',
	group: 'Utilities',
	command: 'say',
	syntax: 'say [message]',
	author: 'TRX',
	permissions: 3,
};

exports.func = async (message,args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		if (args[0]){
			const sayMessage = args.join(' ');
			//We delete the command message (sneaky, right?).
			message.delete(); 
			// And we get the bot to say the thing: 
			message.channel.send(sayMessage);
			log.info(`${message.member.displayName} (${message.author.username}#${message.author.discriminator}) made Tron talk. `);
		} else {
			message.reply('You did not provide any arguments.');
		}
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.username}#${message.author.discriminator}, i could not speak due to: ${err}`);
	}
};
