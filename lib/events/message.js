exports.func = (client, message) => {
    const elevation = require(`${client.config.folders.functions}/elevation.js`);
    const log = require(`${client.config.folders.lib}/log.js`)('onMessage');
    try {
        // Reject message if the message author is a bot or the message is not in a guild (eg. DMs)
        if (message.author.bot || !message.guild) return;
        // Find message's guild in the database
        client.ServerModel.findOne({
            where: {
                guildId: message.guild.id
            }
        }).then((msgserver) => {
            let command, args;
            // Loop through possible prefixes to check if message is a command - this is a bit confusing because if the message is a command, then it is set to false (this is just so I could use .every())
            const notCommand = [msgserver.altPrefix, client.config.prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`].every(prefix => {
                if (message.content.toLowerCase().startsWith(prefix)) { // Check if message starts with prefix
                    command = message.content.slice(prefix.length).trim().split(' ')[0]; // Get the name of the command
                    args = message.content.slice(prefix.length).trim().split(' ').slice(1); // Get the args of the command
                    if (command == '') {
                        return true;
                    }
                    return false;
                }
                return true;
            });
            if (notCommand) {
                if (message.content.toLowerCase().startsWith(':') && message.content.toLowerCase().endsWith(':') /*&& (message.content.indexOf(' ') == -1)*/) {
                    emoji(message, log);
                    return;
                }
                updateUser(client, message, log).then(() => {
                    return;
                });
                return;
            }
            let cmd;
            // Check whether command exists as a file. (loaded in the commands collection)
            if (client.commands.has(command)) {
                // Fetch the command's prototype
                cmd = client.commands.get(command);
            } else {
                return message.reply('Command does not exist.');
            }
            //Check if command is registered in the database.
            client.CommandModel.findOne({
                where: {
                    guildId: message.guild.id,
                    name: command
                }
            }).then((cmdExists) => {
                //If it is disabled return.
                if (cmdExists && cmdExists.enabled == false) {
                    message.reply(`Command is disabled in ${message.guild.name}.`);
                    return;
                }
                // Sometimes a message doesn't have a member object attached (idk either like wtf)
                if (!message.member) {
                    message.member = message.guild.fetchMember(message);
                }
                // Get user's permission level
                elevation.func(client, message).then((msgelevation) => {
                    if (msgelevation >= cmd.data.permissions) { // Check that the user exceeds the command's required elevation
                        cmd.func(message, args, client); // Run the command's function
                    } else {
                        message.reply(':scream: You don\'t have permission to use this command.');
                    }
                });
            });
        });
    } catch (err) {
        log.error(`Something went wrong when handling a message: ${err}`);
    }
}

// Update User
async function updateUser (client, message, log){
	//Check if user exists in db
	const userExists = await client.ProfilesModel.findOne({
		where: {
			guildId: message.guild.id,
			username: message.author.username
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
		await client.ProfilesModel.create({
			guildId: message.guild.id,
			username: message.author.username,
			discordid: message.author.id
		});
		log.info(`Created db entry for user ${message.author.username}.`);
	}
	return;
}


function emoji(message, log){
	if (message.content == ':yerts:'){
		message.channel.send('Damn it Yerts...', {file:'https://i.imgur.com/1XpZHPe.gif'});
		log.info(`${message.author.tag} used the Yerts emoji!`);
		message.delete();
	}
	return;
}