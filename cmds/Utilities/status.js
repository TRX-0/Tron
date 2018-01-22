exports.data = {
	name: 'Status',
	command: 'status',
	description: 'Change bot status or game.',
	group: 'Utilities',
	syntax: 'status [online/invisible/dnd/idle/game] [optional:game]',
	author: 'Aris A.',
	permissions: 3
};

exports.func = async (msg, args, bot) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Status');
	try{
		switch (args[0]) {
		case 'game': {
			if (args.length >= 2){
				var Game = '';
				for (var i=1; i <= args.length-1; i++){
					Game = Game + ' ' + args[i];
				}
				bot.user.setPresence({ game: { name: `${Game}`, type: 0 } });
				msg.channel.send('Game successfully set!');
				log.info(`${msg.author.tag} set tron game.`);
			} else {
				msg.reply('You did not specify a game.');
			}
			break;
		}
		case 'online': {
			bot.user.setStatus('online');
			msg.channel.send('Status successfully set!');
			log.info(`${msg.author.tag} set tron status to Online.`);
			break;
		}
		case 'idle':{
			bot.user.setStatus('idle');
			msg.channel.send('Status successfully set!');
			log.info(`${msg.author.tag} set tron status to Idle.`);
			break;
		}
		case 'dnd':{
			bot.user.setStatus('dnd');
			msg.channel.send('Status successfully set!');
			log.info(`${msg.author.tag} set tron status to Do not Disturb.`);
			break;
		}
		case 'invisible':{
			bot.user.setStatus('invisible');
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
