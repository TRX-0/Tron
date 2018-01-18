exports.data = {
	name: 'Load',
	command: 'load',
	description: 'Loads a command.',
	group: 'system',
	syntax: 'load [command]',
	author: 'Aris A.',
	permissions: 4,
	anywhere: true
};

const jetpack = require('fs-jetpack');
const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

exports.func = async (msg, args, bot) => {
	try {
		if (args[0]){ // Check that user has provided arguments
			let exists;
			const folderList = jetpack.list(`${config.folders.commands}`); // List contents of the cmds folder
			folderList.forEach(folder => { // Loop through the folders
				try {
					const cmdList = jetpack.list(`${config.folders.commands}/${folder}/`); // Loop through the files
					cmdList.forEach(file => {
						if (`${file}` == `${args[0]}.js`){
							exists = true;
						}
					});	
				} catch (err) {
					log.error(`Something went wrong: ${err}`);
				}
			});
			if (exists){
				const m = await msg.channel.send(`Loading: ${args[0]}`);
				await bot.load(args[0]);
				await m.edit(`Successfully loaded: ${args[0]}`);
				log.info(`${msg.author.tag} has loaded ${args[0]} in #${msg.channel.name} on ${msg.guild.name}.`);
			} else {
				msg.reply('Specified command does not exist.');
			}
		} else {
			msg.reply('You did not provide any arguments.');
		}
	} catch (err) {
		log.error(`Something went wrong in load.js: ${err}`);
	}
};
