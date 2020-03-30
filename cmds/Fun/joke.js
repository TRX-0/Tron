exports.data = {
	name: 'Joke',
	description: 'Tells you a joke.',
	group: 'Fun',
	command: 'joke',
	syntax: 'joke',
	author: 'TRX',
	permissions: 1,
};

const http = require ('http');

exports.func = async (message) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		http.get('http://api.icndb.com/jokes/random', (res) => {
			const { statusCode } = res;
			const contentType = res.headers['content-type'];
      
			let error;
			//Get Errors
			if (statusCode !== 200) {
				error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
			} else if (!/^application\/json/.test(contentType)) {
				error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
			}

			//Output Errors
			if (error) {
				log.error(`Sorry ${message.author.tag} error on joke retrieval: ${error}`);
				// consume response data to free up memory
				res.resume();
				return;
			}
      
			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				const parsedData = JSON.parse(rawData);
				message.channel.send('', {embed: {
					fields: [{
						name: 'Here is your Joke!',
						value: parsedData.value.joke
					}
					],
					color: 0x0048C3
				}});
				log.info(`${message.author.username}#${message.author.discriminator} just joked around in ${message.channel.name}`);
			});
		});
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag} i could not find any jokes due to ${err}`);
	}
};
