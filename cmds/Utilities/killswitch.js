exports.data = {
	name: 'Killswitch',
	description: 'Omae wa mou Shindeiru.',
	group: 'Utilities',
	command: 'killswitch',
	syntax: 'killswitch',
	author: 'TRX',
	permissions: 5,
};

exports.func = async (message,args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		const members = message.guild.members.cache;
		members.forEach( async member => {
			if (member.id == message.client.auth.ownerID) {
				return log.info('I am not kicking my master!');
			}
			if (member.id == '398967169062535169') {
				return log.info('I am not kicking myself!');
			}
			if (!member.kickable) {
				return log.info(`Member ${member.user.username} is not kickable!`);
			}
			const DM = await member.createDM();
			await DM.send('You have been kicked from "INSSec Group - Uniwa" because we are migrating to a new server. Please join this server instead: https://discord.gg/dHVrJJe');
			await member.kick(['Migration']);
			log.info(`Member ${member.user.username} has been kicked!`);
		});
	} catch (err) {
		message.reply('Nani?');
		log.error(`Something went wrong when annihilating someone: ${err}`);
	}
};
