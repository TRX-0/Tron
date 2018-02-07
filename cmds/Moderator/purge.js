exports.data = {
	name: 'Purge',
	description: 'This command removes all messages from all users in the channel, up to 100.',
	group: 'Moderator',
	command: 'purge',
	syntax: 'purge [amount]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

exports.func = async (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Purge');
	try{
		var deleteCount = 0;
		if(args[0].toLowerCase() == 'own'){
			const searchCount = parseInt(args[1], 10);
			if(!searchCount || searchCount < 2 || searchCount > 100){
				return msg.reply('Please provide a number between 2 and 100');
			}
			const fetched = await msg.channel.fetchMessages({limit: searchCount});
			fetched.forEach(element => {
				if(element.author.id == msg.client.user.id){
					element.delete();
					deleteCount++;
				}
			});
			msg.delete();
			log.info(`${msg.author.tag} deleted ${deleteCount} messages. `);
		} else if (args[0].toLowerCase() == 'mine'){
			const searchCount = parseInt(args[1], 10);
			if(!searchCount || searchCount < 2 || searchCount > 100){
				return msg.reply('Please provide a number between 2 and 100');
			}
			
			const fetched = await msg.channel.fetchMessages({limit: searchCount});
			fetched.forEach(element => {
				if(element.author.id == msg.author.id){
					element.delete();
					deleteCount++;
				}
			});
			log.info(`${msg.author.tag} deleted ${deleteCount} messages. `);
		} else {
			//Get the delete count, as an actual number.
			const deleteCount = parseInt(args[0], 10);
			if(!deleteCount || deleteCount < 2 || deleteCount > 100){
				return msg.reply('Please provide a number between 2 and 100');
			}
			// So we get our messages, and delete them. Simple enough, right?
			const fetched = await msg.channel.fetchMessages({limit: deleteCount});
			msg.channel.bulkDelete(fetched);
			log.info(`${msg.author.tag} deleted ${deleteCount} messages. `);
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} Couldn't delete messages because of: ${err}`);
	}
};