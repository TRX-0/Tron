exports.data = {
	name: 'Load',
	command: 'load',
	description: 'Loads a command.',
	group: 'System',
	syntax: 'load [command]',
	author: 'Aris A.',
	permissions: 4,
	anywhere: true
};

const jetpack = require('fs-jetpack');

exports.func = async (msg, args, bot) => {
	const log = require(`${bot.config.folders.lib}/log.js`)('Load');
	try {
		//Check that user has provided arguments
		if (args[0]){ 
			let exists;
			//List contents of the cmds folder
			const folderList = jetpack.list(`${bot.config.folders.commands}`); 
			//Loop through the folders
			folderList.forEach(folder => {
				try {
					//List files
					const cmdList = jetpack.list(`${bot.config.folders.commands}/${folder}/`); 
					//Loop through the files
					cmdList.forEach(async file => {
						//If file is found
						if (`${file}` == `${args[0]}.js`){
							exists = true;
							//If the command is not already laoded
							if (!bot.commands.has(args[0])){
								const m = await msg.channel.send(`Loading: ${args[0]}`);
								// Load command
								const cmd = require(`${bot.config.folders.commands}/${folder}/${args[0]}.js`);
								//Add to the bot's collection of commands; 
								bot.commands.set(args[0], cmd); 
								//Create db entries for all guilds
								bot.guilds.keyArray().forEach(async id => {
									const guild = bot.guilds.get(id); // Get guild object
									const cmdExists = await bot.CMDModel.findOne({
										where:{
											guildId: id,
											name: args[0]
										}
									});
									if (!cmdExists){
										await bot.CMDModel.create({
											guildId: id,
											name: args[0],
											enabled: true
										});
										log.info(`Created db command entry for: ${args[0]} in ${guild.name}`);
									}
								});
								await m.edit(`Successfully loaded: ${args[0]}`);
								log.info(`${msg.author.tag} has loaded ${args[0]} in #${msg.channel.name} on ${msg.guild.name}.`);
							} else {
								msg.reply('Command is already loaded.');
							}
						}
					});	
				} catch (err) {
					log.error(`Something went wrong: ${err}`);
				}
			});
			if (!exists){
				msg.reply('Specified command does not exist.');
			}
		} else {
			msg.reply('You did not provide any arguments.');
		}
	} catch (err) {
		log.error(`Something went wrong in load.js: ${err}`);
	}
};
