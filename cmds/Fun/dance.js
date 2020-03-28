exports.data = {
	name: 'Dance',
	description: 'Does a little dance!',
	group: 'Fun',
	command: 'dance',
	syntax: 'dance',
	author: 'Aris A.',
	permissions: 1,
};

this.danceList = [
	['(>\'-\')>', '<(\'-\'<)', '^(\'-\')^', 'v(\'-\')v', '(>\'-\')>', '(^-^)'],
	['ヽ(\'-\'ヽ)', '(∕\'-\')∕', 'ヽ(\'-\'ヽ)', '(\'-\')'],
	['¯\\_(ツ)_/¯', '_/¯(ツ)¯\\_', '¯\\_(ツ)¯\\_', '_/¯(ツ)_/¯', '(ツ)'],
	['┗(＾0＾)┓', '┎(＾0＾)┛', '┗(＾0＾)┛', '┎(＾0＾)┓', '(＾0＾)'],
	['(◞ﾟ▽ﾟ)◞' ,'◟(ﾟ▽ﾟ◟)', '◟(ﾟ▽ﾟ)◞', '(ﾟ▽ﾟ)']
];

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
  
exports.func = async (msg) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		const random = Math.floor(Math.random() * this.danceList.length);
		const sent = await msg.channel.send(this.danceList[random][0]);
		await sleep(1000);
		for(var i = 1; i < this.danceList[random].length; i++) {
			await sent.edit(this.danceList[random][i]);
			await sleep(1000);
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag}, someting went wrong: ${err}`);
	}
};
