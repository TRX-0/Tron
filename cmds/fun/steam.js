exports.data = {
	name: 'Steam Embeds',
	nick: 'steam',
	command: 'steam',
	description: 'Creates embeds for Steam profiles',
	group: 'embeds',
	author: 'Matt C: matt@artemisbot.uk',
	syntax: 'steam [vanity/id]',
	permissions: 0,
	anywhere: true
};

const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);
const request = require('request-promise-native');
const moment = require('moment');
const humanize = require('humanize-duration');

exports.func = async (msg, args) => {
	try {
		msg.channel.startTyping();
		const r = request.defaults({
			baseUrl: `https://api.steampowered.com`,
			json: true
		});
		let id = args[0];
		if (!(id.match(/^[0-9]+$/))) {
			id = (await r(`/ISteamUser/ResolveVanityURL/v1/?key=${config.steamKey}&vanityurl=${args}`)).response.steamid;
		}
		const [profile, friends, games, level] = await Promise.all([
			r(`/ISteamUser/GetPlayerSummaries/v2/?key=${config.steamKey}&steamids=${id}`),
			r(`/ISteamUser/GetFriendList/v1/?key=${config.steamKey}&steamid=${id}`),
			r(`/IPlayerService/GetOwnedGames/v1/?key=${config.steamKey}&steamid=${id}&include_appinfo=false&include_played_free_games=false`),
			r(`/IPlayerService/GetSteamLevel/v1/?key=${config.steamKey}&steamid=${id}`)
		]);
		log.verbose(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has requested ${profile.response.players[0].personaname}'s steam profile in #${msg.channel.name} on ${msg.guild.name}.`);
		const embed = {
			author: {
				name: `${profile.response.players[0].personaname} on Steam.`,
				url: `https://steamcommunity.com/profiles/${id}/`,
				icon_url: 'https://cdn.artemisbot.uk/img/steam.png'
			},
			color: 0x102753,
			thumbnail: {url: profile.response.players[0].avatarmedium},
			fields: [
				{
					name: 'Games',
					value: games.response.game_count,
					inline: true
				},
				{
					name: 'Account Age',
					value: humanize(moment().diff(moment.unix(profile.response.players[0].timecreated)), {
						largest: 2,
						round: true
					}),
					inline: true
				},
				{
					name: 'Friends',
					value: friends.friendslist.friends.length,
					inline: true
				},
				{
					name: 'Level',
					value: level.response.player_level,
					inline: true
				}
			],
			footer: {
				text: `Powered by Steam API. Took ${moment().diff(msg.createdAt)} ms.`
			}
		};
		msg.channel.stopTyping();
		await msg.channel.send('', {embed})
          .catch(log.error);
	} catch (err) {
		msg.channel.stopTyping();
		msg.reply('Fail. User probably has private profile/Steam API is down.').catch(log.error);
	}
};
