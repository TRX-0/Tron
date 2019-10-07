exports.data = {
	name: 'Verification',
	command: 'verification',
	description: 'Enable email verification on server',
	group: 'Utilities',
	syntax: 'verification [enable/disable/status] [text]',
	author: 'Aris A.',
	permissions: 3
};

exports.func = async (msg, args, bot) => {
	const Database = require(`${bot.config.folders.lib}/db.js`);
	const log = require(`${bot.config.folders.lib}/log.js`)('Verification');
	try{
		switch(args[0]) {
		case 'enable': 
		{
			const server = await bot.Server.findOne({ // Attempt to find server with ID
				where: {
					guildId: msg.channel.guild.id
				}
			});
			if (server){
				
			}
		}
		case 'disable':
		{
			const server = await bot.Server.findOne({ // Attempt to find server with ID
				where: {
					guildId: msg.channel.guild.id
				}
			});
		}
		default:
		{
			msg.reply('Invalid arguments.');
			break;
		}
		}
	} catch (err){
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} unable to enable verification due to ${err}`);
	}
};
