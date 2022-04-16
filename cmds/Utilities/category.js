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

	const categories = [
		{
			id: '647428242516738049',
			name: 'Web',
			alias: []
		},
		{
			id: '647428396787171338',
			name: 'Pwn',
			alias: ['binexp']
		},
		{
			id: '647428478735745060',
			name: 'Reversing',
			alias: ['reverse']
		},
		{
			id: '647428302071398442',
			name: 'Crypto',
			alias: []
		},
		{
			id: '780147661465452654',
			name: 'Hardware',
			alias: []
		},
		{
			id: '647428334719991831',
			name: 'Forensics',
			alias: []
		},
		{
			id: '780147471249571900',
			name: 'Blockchain',
			alias: []
		}
	];

	try{
		if (message.guild.id != '630820897980416023') {
			return message.reply('This command can only be used in the "INSSec Uniwa" Server.');
		}
		if (args[0] == undefined) {
			return message.reply('Please provide a role to add.')
		}

		let category = categories.find(c => c.name.toLowerCase() == args[0].toLowerCase() || c.alias.includes(args[0].toLowerCase()));

		if (category === undefined) {
			return message.reply(`The role you specified is incorrect. Select from the following list: ${categories.map(c => c.name).join(', ')}`);
		}

		if (message.member.roles.cache.has(category.id)) {
			message.member.roles.remove(category.id);
			return message.reply(`Removed the ${category.name} role.`);
		}

		await message.member.roles.add(category.id);

		return message.reply(`You have been given the ${category.name} role.`);
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Something went wrong when choosing categories: ${err}`);
	}
};
