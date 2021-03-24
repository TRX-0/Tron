exports.data = {
	name: 'Category',
	description: 'Adds a category role to you.',
	group: 'Utilities',
	command: 'category',
	syntax: 'category [web/crypto/pwn/reversing/hardware/blockchain/forensics]',
	author: 'TRX',
	permissions: 1,
};

exports.func = async (message,args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		if (message.guild.id != '630820897980416023') {
			return message.reply('This command can only be used in the "INSSec Uniwa" Server.');
		}
		if (args[0] == undefined) {
			return message.reply('Please provide a role to add.')
		}
		switch (args[0].toLowerCase()){
			case 'web':
				if (message.member.roles.cache.has('647428242516738049')) {
					message.member.roles.remove('647428242516738049');
				} else {
					message.member.roles.add('647428242516738049');
				}
				break;
			case 'pwn':
				if (message.member.roles.cache.has('647428396787171338')) {
					message.member.roles.remove('647428396787171338');
				} else {
					message.member.roles.add('647428396787171338');
				}
				break;
			case 'reversing':
				if (message.member.roles.cache.has('647428478735745060')) {
					message.member.roles.remove('647428478735745060');
				} else {
					message.member.roles.add('647428478735745060');
				}
				break;
			case 'crypto':
				if (message.member.roles.cache.has('647428302071398442')) {
					message.member.roles.remove('647428302071398442');
				} else {
					message.member.roles.add('647428302071398442');
				}
				break;
			case 'hardware':
				if (message.member.roles.cache.has('780147661465452654')) {
					message.member.roles.remove('780147661465452654');
				} else {
					message.member.roles.add('780147661465452654');
				}
				break;
			case 'forensics':
				if (message.member.roles.cache.has('647428334719991831')) {
					message.member.roles.remove('647428334719991831');
				} else {
					message.member.roles.add('647428334719991831');
				}
				break;
			case 'blockchain':
				if (message.member.roles.cache.has('780147471249571900')) {
					message.member.roles.remove('780147471249571900');
				} else {
					message.member.roles.add('780147471249571900');
				}
				break;
			default:
				return message.reply('The role you specified is incorrect. Select from the following list: Web, Pwn, Crypto, Reverse, Forensic, Stego.')
		}
		message.reply('Role changes have been applied!');
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Something went wrong when choosing categories: ${err}`);
	}
};
