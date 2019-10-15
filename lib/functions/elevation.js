exports.func = (bot, msg, user) => {
	const log = require(`${bot.config.folders.lib}/log.js`)('Elevation');
	return new Promise(async (resolve, reject) => {
		try {
			const impUser = user || msg.author; // If there is a user object, this is the user we care about, otherwise, just message author
			const impMember = user ? await msg.guild.fetchMember(user.id) : msg.member; // If we care about the user object, we have no member object - fetch it
			if (impUser.id === bot.auth.ownerID) { // If the author's ID is the same as the bot owner's then give them top perms
				resolve(5);
			}
			const server = await bot.ServerModel.findOne({ // Fetch server object
				where: {
					guildId: msg.guild.id
				}
			});
			const isAdmin = await bot.ProfilesModel.findOne({
				where:{
					discordid: impUser.id
				}
			});
			if (isAdmin && isAdmin.admin == true) { // If user is an admin in the server
				resolve(4);
			}
			server.perm3.forEach(id => { // Loop through level 3 permissions for the server, check user against them
				if (impMember.roles.has(id)) {
					resolve(3);
				}
			});
			server.perm2.forEach(id => { // Loop through level 2 permissions for the server, check user against them
				if (impMember.roles.has(id)) {
					resolve(2);
				}
			});
			server.perm1.forEach(id => { // Loop through level 1 permissions for the server, check user against them
				if (impMember.roles.has(id)) {
					resolve(1);
				}
			});
			resolve(0); // Otherwise nothing
		} catch (err) {
			log.error(`Error on message evelvation: ${err}`);
			reject(err);
		}
	});
};