exports.data = {
	name: 'Reload',
	command: 'reload',
	description: 'Reloads a command.',
	group: 'System',
	syntax: 'reload [command]',
	author: 'TRX',
	permissions: 4
};

const jetpack = require('fs-jetpack');

exports.func = async (message, args, client) => {
	const log = require(`${client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		//Check that user has provided arguments
		if (args[0]){ 
			//Check if provided argument corresponds to an existing command
			if (client.commands.has(args[0])) {
				const m = await message.channel.send(`Reloading: ${args[0]}`);
				//List contents of the cmds folder
				const folderList = jetpack.list(`${client.config.folders.commands}`); 
				//Loop through the folders
				folderList.forEach(folder => {
					try {
						//List files
						const cmdList = jetpack.list(`${client.config.folders.commands}/${folder}/`);
						//Loop through the files
						cmdList.forEach(file => {
							if (`${file}` == `${args[0]}.js`){
								//Delete command from cache
								delete require.cache[require.resolve(`${client.config.folders.commands}/${folder}/${args[0]}.js`)]; 
								//Load command
								const cmd = require(`${client.config.folders.commands}/${folder}/${args[0]}.js`);
								//Delete command from collection
								client.commands.delete(args[0]);
								//Re-add to the bot's collection of commands
								client.commands.set(args[0], cmd); 
							}
						});	
					} catch (err) {
						log.error(`Error on command reload inner loop: ${err}`);
					}
				});
				await m.edit(`Successfully reloaded: ${args[0]}`);
				log.info(`${message.author.tag} has reloaded ${args[0]} on ${message.guild.name}.`);
			} else {
				message.reply('Specified command does not exist.');
			}
		} else {
			message.reply('You did not provide any arguments.');
		}
	} catch (err) {
		log.error(`Something went wrong: ${err}`);
	}
};
