exports.data = {
	name: 'Base64',
	command: 'base64',
	description: 'Encrypt and Decrypt in Base64.',
	group: 'Utilities',
	syntax: 'base64 [encrypt/decrypt] [text]',
	author: 'Aris A.',
	permissions: 2
};

const atob = require('atob');
const btoa = require('btoa');

exports.func = async (msg, args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Base64');
	try{
		switch(args[0]) {
		case 'encode': 
		{
			const result = await btoa(args.slice(1).join(' '));
			msg.channel.send('', {embed: {
				fields: [{
					name: 'Encoded Text',
					value: result
				}],
				color: 0x0048C3
			}});
			break;
		}
		case 'decode':
		{
			const result = await (atob(args[1]));
			msg.channel.send('', {embed: {
				fields: [{
					name: 'Decoded Text',
					value: result
				}],
				color: 0x0048C3
			}});
			break;
		}
		default:
		{
			msg.reply('Invalid argument.');
			break;
		}
		}
	} catch (err){
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} unable to base64 due to ${err}`);
	}
};
