exports.data = {
	name: 'Remind Me',
	description: 'Adds a reminder. Time syntax: 1s1m1h1d1w1M1y or 26.5.2018/5:25:0',
	group: 'Utilities',
	command: 'remindme',
	syntax: 'remindme [time] [description]',
	author: 'Aris A.',
	permissions: 2,
};

function ParseDate(givenTime){
	if(givenTime.includes('.') && givenTime.includes('/') && givenTime.includes(':')){
		const Values = givenTime.split('/[./:]/');
	} else if (givenTime.includes('s') || givenTime.includes('m') || givenTime.includes('h') || givenTime.includes('d') || givenTime.includes('w') || givenTime.includes('M') || givenTime.includes('y')){
		const Values = givenTime.match(/([0-9]+[smhdwMy])/g);
	}

}

exports.func = async (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Say');
	
	try{
		if (args[0] && args[1] && !args[2]){
			const time = '1s1m1h1d1w1M1y'; //this is date based
			const Values = ParseDate(time);
			log.info(`${Values}`);

		} else {
			msg.reply('Wrong arguments. Syntax is: remindme [time] [description]');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag}, i could not add a reminder due to: ${err}`);
	}
};
