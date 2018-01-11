exports.data = {
	name: 'Rotate 13',
	command: 'rot13',
	description: 'Encrypt and Decrypt in rot13.',
	group: 'fun',
	syntax: 'rot13 [text]',
	author: 'Aris A.',
	permissions: 3
};

const log = require('../../lib/log.js')(exports.data.name);
exports.func = async (msg, args, bot) => {
	try{
		if (args[0]){
			await msg.channel.send('', {embed: {
				fields: [{
					name: "Rotated Text",
					value: (args.slice(0).join(' ').replace(/[A-Za-z]/g, function (c) {
						return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".charAt(
							   "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm".indexOf(c)
						);
					  } ))
				  }
				],
				color: 0x0048C3
			}});
		} else {
			msg.reply('You did not provide any arguments you idiot!');
		}
	} catch (err){
		msg.reply('Something went wrong.');
		log.error(`Something went wrong: ${err}`);
	}
};
