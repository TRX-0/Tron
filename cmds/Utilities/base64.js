exports.data = {
	name: 'Base64',
	command: 'base64',
	description: 'Encrypt and Decrypt in Base64.',
	group: 'Utilities',
	syntax: 'base64 [Encode/Decode] [text]',
	author: 'TRX',
	permissions: 2
};

const atob = require('atob');
const btoa = require('btoa');

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		switch(args[0]) {
		case 'encode': 
		{
			const result = await btoa(args.slice(1).join(' '));
			message.channel.send({embed: {
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
			message.channel.send({embed: {
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
			message.reply('Invalid argument.');
			break;
		}
		}
	} catch (err){
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag} unable to base64 due to ${err}`);
	}
};
