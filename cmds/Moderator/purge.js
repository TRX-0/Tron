exports.data = {
	name: 'Purge',
	description: 'Removes messages from chat.Own removes bot messages, mine removes command author messages, else removes messages by everyone.',
	group: 'Moderator',
	command: 'purge',
	syntax: 'purge [optional:own/optional:mine] [amount]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

exports.func = (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Purge');
	try{
		var deletedCount = 0;
		if(args[0].toLowerCase() == 'own'){
			const deleteAmount = parseInt(args[1], 10);
			if(!deleteAmount || deleteAmount < 2 || deleteAmount > 100){
				return msg.reply('Please provide a number between 2 and 100');
			}
			let fetched;
			let msgArray = {};
			while (deletedCount <= deleteAmount){
				fetched = msg.channel.fetchMessages({limit: 100});
				for (var element in fetched) {
					if(element.author.id == msg.client.user.id){
						if(deletedCount <= deleteAmount){
							msgArray.push(element);
							deletedCount++;
						} else {
							return;
						}
					}
				}
			}
			msgArray.bulkDelete();
			msg.delete();
			log.info(`${msg.author.tag} deleted ${deletedCount} messages. `);
		} else if (args[0].toLowerCase() == 'mine'){
			const deleteAmount = parseInt(args[1], 10);
			if(!deleteAmount || deleteAmount < 2 || deleteAmount > 100){
				return msg.reply('Please provide a number between 2 and 100');
			}
			while (deletedCount < deleteAmount){
				const fetched = msg.channel.fetchMessages({limit: 100});
				fetched.forEach(element => {
					if(element.author.id == msg.author.id){
						if(deletedCount < deleteAmount){
							element.delete();
							deletedCount++;
						}
					}
				});
			}
			log.info(`${msg.author.tag} deleted ${deletedCount} messages. `);
		} else {
			//Get the delete count, as an actual number.
			const deleteCount = parseInt(args[0], 10);
			if(!deleteCount || deleteCount < 2 || deleteCount > 100){
				return msg.reply('Please provide a number between 2 and 100');
			}
			// So we get our messages, and delete them. Simple enough, right?
			const fetched = msg.channel.fetchMessages({limit: deleteCount});
			msg.channel.bulkDelete(fetched);
			log.info(`${msg.author.tag} deleted ${deleteCount} messages. `);
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} Couldn't delete messages because of: ${err}`);
	}
};