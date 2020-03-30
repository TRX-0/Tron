exports.data = {
	name: 'Load',
	command: 'load',
	description: 'Loads a command.',
	group: 'System',
	syntax: 'load [command]',
	author: 'TRX',
	permissions: 4,
};

const jetpack = require('fs-jetpack');

exports.func = async (message, args, client) => {
	const log = require(`${client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		//Check that user has provided arguments
		if (args[0]){ 
			let exists;
			//List contents of the cmds folder
			const folderList = jetpack.list(`${client.config.folders.commands}`); 
			//Loop through the folders
			folderList.forEach(folder => {
				try {
					//List files
					const cmdList = jetpack.list(`${client.config.folders.commands}/${folder}/`); 
					//Loop through the files
					cmdList.forEach(async file => {
						//If file is found
						if (`${file}` == `${args[0]}.js`){
							exists = true;
							//If the command is not already laoded
							if (!client.commands.has(args[0])){
								const m = await message.channel.send(`Loading: ${args[0]}`);
								// Load command
								const cmd = require(`${client.config.folders.commands}/${folder}/${args[0]}.js`);
								//Add to the bot's collection of commands; 
								client.commands.set(args[0], cmd); 
								//Create db entries for all guilds
								client.guilds.cache.forEach(async guild => {
									const cmdExists = await client.CommandModel.findOne({
										where:{
											guildId: guild.id,
											name: args[0]
										}
									});
									if (!cmdExists){
										await client.CommandModel.create({
											guildId: guild.id,
											name: args[0],
											enabled: true
										});
										log.info(`Created db command entry for: ${args[0]} in ${guild.name}`);
									}
								});
								await m.edit(`Successfully loaded: ${args[0]}`);
								log.info(`${message.author.tag} has loaded ${args[0]} in #${message.channel.name} on ${message.guild.name}.`);
							} else {
								message.reply('Command is already loaded.');
							}
						}
					});	
				} catch (err) {
					log.error(`Something went wrong: ${err}`);
				}
			});
			if (!exists){
				message.reply('Specified command does not exist.');
			}
		} else {
			message.reply('You did not provide any arguments.');
		}
	} catch (err) {
		log.error(`Something went wrong in load.js: ${err}`);
	}
};
