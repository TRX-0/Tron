exports.data = {
	name: 'Reload Command',
	command: 'reload',
	description: 'Reloads a command.',
	group: 'System',
	syntax: 'reload [command]',
	author: 'Aris A.',
	permissions: 4,
	anywhere: true
};

const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);
const jetpack = require('fs-jetpack');

exports.func = async (msg, args, bot) => {
	try {
		//Check that user has provided arguments
		if (args[0]){ 
			//Check if provided argument corresponds to an existing command
			if (bot.commands.has(args[0])) {
				const m = await msg.channel.send(`Reloading: ${args[0]}`);
				//List contents of the cmds folder
				const folderList = jetpack.list(`${bot.config.folders.commands}`); 
				//Loop through the folders
				folderList.forEach(folder => {
					try {
						//List files
						const cmdList = jetpack.list(`${bot.config.folders.commands}/${folder}/`);
						//Loop through the files
						cmdList.forEach(file => {
							if (`${file}` == `${args[0]}.js`){
								//Delete command from cache
								delete require.cache[require.resolve(`${bot.config.folders.commands}/${folder}/${args[0]}.js`)]; 
								//Load command
								const cmd = require(`${bot.config.folders.commands}/${folder}/${args[0]}.js`);
								//Delete command from collection
								bot.commands.delete(args[0]);
								//Re-add to the bot's collection of commands
								bot.commands.set(args[0], cmd); 
							}
						});	
					} catch (err) {
						log.error(`Error on command reload inner loop: ${err}`);
					}
				});
				await m.edit(`Successfully reloaded: ${args[0]}`);
				log.info(`${msg.author.tag} has reloaded ${args[0]} on ${msg.guild.name}.`);
			} else {
				msg.reply('Specified command does not exist.');
			}
		} else {
			msg.reply('You did not provide any arguments.');
		}
	} catch (err) {
		log.error(`Something went wrong: ${err}`);
	}
};
