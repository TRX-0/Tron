exports.data = {
	name: 'Hug',
	description: 'Hugs specified user.',
	group: 'fun',
	command: 'hug',
	syntax: 'hug [@user]',
	author: 'Aris A.',
	permissions: 2,
	anywhere: false
};

const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

exports.func = async (msg,args) => {
    try{
        if (args[0]){
            await msg.delete().catch(O_o=>{});
            await msg.channel.send(`${msg.mentions.users.first()} here is a hug to feel better! `, {embed: {
                color: 0xff8000 ,
                image: {
                    url :"https://media.giphy.com/media/3M4NpbLCTxBqU/giphy.gif"
                }
            }});
        }
    } catch (err) {
        msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag}, i could not hug due to: ${err}`);
    }
};
