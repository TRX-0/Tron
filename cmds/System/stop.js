exports.data = {
	name: 'Stop',
	command: 'stop',
	description: 'Stops bot and exits.',
	group: 'System',
	syntax: 'stop',
	author: 'Aris A.',
	permissions: 4
};
const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

exports.func = async (msg,args,bot) => {
	try {
		await msg.channel.send('Stopping all processes and exiting!');
		await bot.stop();
	} catch (err){
		msg.reply('Something went wrong.');
		log.error(`Something went wrong in stop.js: ${err}`);
	}
};
