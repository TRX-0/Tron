exports.data = {
	name: 'Base64',
	command: 'base64',
	description: 'Encrypt and Decrypt in Base64.',
	group: 'fun',
	syntax: 'base64 [encrypt/decrypt] [text]',
	author: 'Aris A.',
	permissions: 3
};

const moment = require('moment');
const log = require('../../lib/log.js')(exports.data.name);
const atob = require('atob');
const btoa = require('btoa');
exports.func = async (msg, args, bot) => {
	try{
		switch(args[0]) {
			case 'encode': 
			{
				const result = await btoa(args.slice(1).join(' '));
				msg.channel.send('', {embed: {
					fields: [{
						name: "Encoded Text",
						value: result
					  }
					],
					color: 0x0048C3
				}});
				break;
			}
			case 'decode':
			{
				const result = await (atob(args[1]));
				msg.channel.send('', {embed: {
					fields: [{
						name: "Decoded Text",
						value: result
					  }
					],
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
		log.error(`Sorry ${msg.author.username}#${msg.author.discriminator} unable to base64 due to ${err}`);
	}
};
