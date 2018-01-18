exports.data = {
	name: 'WordGame',
	command: 'wgame',
	description: 'Play a random word game.',
	group: 'fun',
	syntax: 'wgame [start/stop/next/stats]',
	author: 'Aris A,',
	permissions: 3
};

const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);
const WordGame = require(`${config.folders.models}/wordgame.js`);

exports.func = async (msg,args,bot) => {
	try {
		if (args[0]){
			//Check if a game for the current server exists.
			const gameExists = await WordGame.findOne({ 
				where: {
					guildID: msg.guild.id,
				}
			});
			switch (args[0]) {
			case 'start':{
				if (gameExists){
					//Check if a game is already started
					const Playing = gameExists.playing;
					if (Playing && Playing == false){
						const CurrentWord = gameExists.currentWord; //Get Current Word.
						//Get a word if none exists.
						if (CurrentWord){
							//Start the game
							await gameExists.update({
								playing: true
							});
							log.info(`${msg.author.tag} has started a random word game on ${msg.guild.name}.`);
						} else {
							//Get random word.
							const newWord = bot.getWord();
							//Start the game with a new word
							await gameExists.update({
								currentWord: newWord.toLowerCase(),
								playing: true
							});
						}
					} else {
						msg.channel.send('Game is already running.');
					}
					//If game does not exist create it.
				} else {
					//Get random word.
					const newWord = bot.getWord();
					//Update db.
					await WordGame.create({
						guildID: msg.guild.id,
						currentWord: newWord.toLowerCase(),
						playing: true
					});
					msg.channel.send('Started a random word game.');
					log.info(`${msg.author.tag} has started a random word game on ${msg.guild.name}.`);
				}
				break;
			}
			case 'stop': {
				if (gameExists){
					const Playing = gameExists.playing;
					if (Playing && Playing == true){
						//Stop playing
						await gameExists.update({
							playing: false
						});
						msg.channel.send('Game succesfully stopped.');
						log.info(`${msg.author.tag} has stopped the random word game on ${msg.guild.name}.`);
					} else {
						msg.channel.send('Game was not running.');
					}
				} else {
					msg.channel.send('Game was not running.');
				}
				break;
			}
			case 'next': {
				if (gameExists){
					const Playing = gameExists.playing;
					if (Playing && Playing == true){
						const CurrentWord = gameExists.currentWord;
						//Get random word.
						const newWord = bot.getWord();
						//Update db.
						await gameExists.update({
							prevWord: CurrentWord,
							currentWord: newWord.toLowerCase()
						});
						msg.channel.send('Generated a new word.');
						log.info(`${msg.author.tag} has changed the random game word on ${msg.guild.name}.`);
					} else {
						msg.channel.send('No game is running');
					}
				} else {
					msg.channel.send('No game is running');
				}
				break;
			}
			case 'stats': {
				if (gameExists){
					if (gameExists.prevWord && gameExists.lastSolvedBy){
						msg.channel.send({
							embed:{
								title: 'Random Word Game Statistics',
								color :  1741218,
								fields:[
									{
										name: 'Total Solved Words',
										value: gameExists.wordsSolved,
										inline: true
									},
									{
										name: 'Previous Word',
										value: gameExists.prevWord,
										inline: true
									},
									{
										name: 'Last Solved By',
										value: gameExists.lastSolvedBy,
										inline: true
									},
									{
										name:'Currently Playing?',
										value: gameExists.playing
									}
								]
							}
						});
					} else {
						msg.channel.send('Some values are empty. No stats returned.');
					}
				} else {
					msg.channel.send('No game is running');
				}
				break;
			}
			case 'word': {
				if (gameExists){
					if (gameExists.currentWord){
						msg.reply(`Current word is: "${gameExists.currentWord}"`);
					} else {
						msg.channel.send('No word is set.');
					}
				}
				break;
			}
			default:{
				msg.reply('Wrong argument.');
				break;
			}
			}
		} else {
			msg.channel.send('You did not provide any argumemts.');
		}
	} catch (err){
		msg.reply('Something went wrong.');
		log.error(`Something went wrong in wgame: ${err}`);
	}
};