exports.data = {
	name: 'Say',
	description: 'Makes Tron say something.',
	group: 'Utilities',
	command: 'say',
	syntax: 'say [message]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

exports.func = async (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		if (args[0]){
			const sayMessage = args.join(' ');
			//We delete the command message (sneaky, right?).
			msg.delete(); 
			// And we get the bot to say the thing: 
			msg.channel.send(sayMessage);
			log.info(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) made Tron talk. `);
		} else {
			msg.reply('You did not provide any arguments.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.username}#${msg.author.discriminator}, i could not speak due to: ${err}`);
	}
};
