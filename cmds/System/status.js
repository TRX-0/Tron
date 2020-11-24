exports.data = {
	name: 'Status',
	command: 'status',
	description: 'Change bot status.',
	group: 'Utilities',
	syntax: 'status [online/invisible/dnd/idle]',
	author: 'TRX',
	permissions: 4
};

exports.func = async (message, args, client) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		switch (args[0].toLowerCase()) {
		case 'online': {
			client.user.setStatus('online');
			message.channel.send('Status successfully set!');
			log.info(`${message.author.tag} set tron status to Online.`);
			break;
		}
		case 'idle':{
			client.user.setStatus('idle');
			message.channel.send('Status successfully set!');
			log.info(`${message.author.tag} set tron status to Idle.`);
			break;
		}
		case 'dnd':{
			client.user.setStatus('dnd');
			message.channel.send('Status successfully set!');
			log.info(`${message.author.tag} set tron status to Do not Disturb.`);
			break;
		}
		case 'invisible':{
			client.user.setStatus('invisible');
			message.channel.send('Status successfully set!');
			log.info(`${message.author.tag} set tron status to invisible.`);
			break;
		}
		default: {
			message.reply('Wrong argument.');
		}
		}
	} catch (err){
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag} unable to set status due to ${err}`);
	}
};
