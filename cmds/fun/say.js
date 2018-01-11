exports.data = {
	name: 'Say',
	description: 'Makes Tron say something.',
	group: 'fun',
	command: 'say',
	syntax: 'say [message]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

const log = require('../../lib/log.js')(exports.data.name);

exports.func = async (msg,args) => {
    try{
        const sayMessage = args.join(" ");
        //We delete the command message (sneaky, right?).
        msg.delete().catch(O_o=>{}); 
        // And we get the bot to say the thing: 
        msg.channel.send(sayMessage);
        log.info(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) made Tron talk. `);
    } catch (err) {
        msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.username}#${msg.author.discriminator}, i could not speak due to: ${err}`);
    }
};
