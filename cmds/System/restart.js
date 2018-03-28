exports.data = {
	name: 'Restart',
	command: 'restart',
	description: 'Restarts Bot.',
	group: 'System',
	syntax: 'restart',
	author: 'Aris A.',
	permissions: 3
};

exports.func = async (msg,args,bot) => {
	const log = require(`${bot.config.folders.lib}/log.js`)('Restart');
	try {
		await msg.channel.send('Restarting!');
		await bot.restart(msg);
	} catch (err){
		msg.reply('Something went wrong.');
		log.error(`Something went wrong in stop.js: ${err}`);
	}
};