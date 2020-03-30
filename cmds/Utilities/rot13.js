exports.data = {
	name: 'Rot13',
	command: 'rot13',
	description: 'Encrypt and Decrypt in rot13.',
	group: 'Utilities',
	syntax: 'rot13 [text]',
	author: 'TRX',
	permissions: 2
};

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		if (args[0]){
			await message.channel.send('', {embed: {
				fields: [{
					name: 'Rotated Text',
					value: (args.slice(0).join(' ').replace(/[A-Za-z]/g, function (c) {
						return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.charAt('NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm'.indexOf(c));
					}))
				}],
				color: 0x0048C3
			}});
		} else {
			message.reply('You did not provide any arguments you idiot!');
		}
	} catch (err){
		message.reply('Something went wrong.');
		log.error(`Error on rot13 function due to: ${err}`);
	}
};
