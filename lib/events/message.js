exports.func = (bot, msg) => {
    const elevation = require(`${bot.config.folders.functions}/elevation.js`);
    const log = require(`${bot.config.folders.lib}/log.js`)('onMessage');
    try {
        // Reject message if the message author is a bot or the message is not in a guild (eg. DMs)
        if (msg.author.bot || !msg.guild) return;
        // Find message's guild in the database
        bot.Server.findOne({
            where: {
                guildId: msg.guild.id
            }
        }).then((msgserver) => {
            let command, args;
            // Loop through possible prefixes to check if message is a command - this is a bit confusing because if the message is a command, then it is set to false (this is just so I could use .every())
            const notCommand = [msgserver.altPrefix, bot.config.prefix, `<@${bot.user.id}>`, `<@!${bot.user.id}>`].every(prefix => {
                if (msg.content.toLowerCase().startsWith(prefix)) { // Check if message starts with prefix
                    command = msg.content.slice(prefix.length).trim().split(' ')[0]; // Get the name of the command
                    args = msg.content.slice(prefix.length).trim().split(' ').slice(1); // Get the args of the command
                    if (command == '') {
                        return true;
                    }
                    return false;
                }
                return true;
            });
            if (notCommand) {
                if (msg.content.toLowerCase().startsWith(':') && msg.content.toLowerCase().endsWith(':') /*&& (msg.content.indexOf(' ') == -1)*/) {
                    emoji(msg, log);
                    return;
                }
                updateUser(msg,log).then(() => {
                    return;
                });
                return;
            }
            let cmd;
            // Check whether command exists as a file. (loaded in the commands collection)
            if (bot.commands.has(command)) {
                // Fetch the command's prototype
                cmd = bot.commands.get(command);
            } else {
                return msg.reply('Command does not exist.');
            }
            //Check if command is registered in the database.
            bot.CMDModel.findOne({
                where: {
                    guildId: msg.guild.id,
                    name: command
                }
            }).then((cmdExists) => {
                //If it is disabled return.
                if (cmdExists && cmdExists.enabled == false) {
                    msg.reply(`Command is disabled in ${msg.guild.name}.`);
                    return;
                }
                // Sometimes a message doesn't have a member object attached (idk either like wtf)
                if (!msg.member) {
                    msg.member = msg.guild.fetchMember(msg);
                }
                // Get user's permission level
                elevation.func(bot, msg).then((msgelevation) => {
                    if (msgelevation >= cmd.data.permissions) { // Check that the user exceeds the command's required elevation
                        cmd.func(msg, args, bot); // Run the command's function
                    } else {
                        msg.reply(':scream: You don\'t have permission to use this command.');
                    }
                });
            });
        });
    } catch (err) {
        log.error(`Something went wrong when handling a message: ${err}`);
    }
}

// Update User
async function updateUser (msg, log){
    const Profiles = require(`${msg.client.config.folders.models}/profiles.js`);
	//Check if user exists in db
	const userExists = await Profiles.findOne({
		where: {
			guildId: msg.guild.id,
			username: msg.author.username
		}
	});
	//If user exists
	if (userExists){
		//Get message count and add one more
		var UserCount = userExists.msgcount + 1;
		await userExists.update({
			msgcount: UserCount
		});
	} else {
		//Else create user entry in db
		await Profiles.create({
			guildId: msg.guild.id,
			username: msg.author.username,
			discordid: msg.author.id
		});
		log.info(`Created db entry for user ${msg.author.username}.`);
	}
	return;
}


function emoji(msg, log){
	if (msg.content == ':yerts:'){
		msg.channel.send('Damn it Yerts...', {file:'https://i.imgur.com/1XpZHPe.gif'});
		log.info(`${msg.author.tag} used the Yerts emoji!`);
		msg.delete();
	}
	return;
}