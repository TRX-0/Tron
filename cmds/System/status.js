exports.data = {
	name: 'Status',
	command: 'status',
	description: 'Change bot status.',
	group: 'Utilities',
	syntax: 'status [online/invisible/dnd/idle/game]',
	author: 'TRX',
	permissions: 4
};

exports.func = async (msg, args, client) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		switch (args[0].toLowerCase()) {
		case 'online': {
			client.user.setStatus('online');
			msg.channel.send('Status successfully set!');
			log.info(`${msg.author.tag} set tron status to Online.`);
			break;
		}
		case 'idle':{
			client.user.setStatus('idle');
			msg.channel.send('Status successfully set!');
			log.info(`${msg.author.tag} set tron status to Idle.`);
			break;
		}
		case 'dnd':{
			client.user.setStatus('dnd');
			msg.channel.send('Status successfully set!');
			log.info(`${msg.author.tag} set tron status to Do not Disturb.`);
			break;
		}
		case 'invisible':{
			client.user.setStatus('invisible');
			msg.channel.send('Status successfully set!');
			log.info(`${msg.author.tag} set tron status to invisible.`);
			break;
		}
		default: {
			msg.reply('Wrong argument.');
		}
		}
	} catch (err){
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} unable to set status due to ${err}`);
	}
};
