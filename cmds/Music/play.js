exports.data = {
	name: 'Play',
	description: 'Plays a song.',
	group: 'Music',
	command: 'play',
	syntax: 'play [song]',
	author: 'TRX',
	permissions: 2,
};

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	const ytdl = require("ytdl-core");

	try {
		const queue = message.client.queue;
		const serverQueue = message.client.queue.get(message.guild.id);

		const voiceChannel = message.member.voice.channel;

		if (!voiceChannel)
			return message.channel.send(
				"You need to be in a voice channel to play music!"
			);
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
			return message.channel.send(
				"I need the permissions to join and speak in your voice channel!"
			);
		}

		const songInfo = await ytdl.getInfo(args[0]);
		const song = {
			thumbnail: songInfo.thumbnail,
			title: songInfo.title,
			url: songInfo.video_url,
			duration: songInfo.duration
		};

		if (!serverQueue) {
			const queueContruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 50,
				playing: true
			};

			queue.set(message.guild.id, queueContruct);
			queueContruct.songs.push(song);

			try {
				var connection = await voiceChannel.join();
				queueContruct.connection = connection;
				play(message, queueContruct.songs[0], log);
			} catch (err) {
				console.log(err);
				queue.delete(message.guild.id);
				return message.channel.send(err);
			}
		} else {
			serverQueue.songs.push(song);
			return message.channel.send(
				`**${song.title}** has been added to the queue!`
			);
		}
	} catch (error) {
		log.error(error);
		message.channel.send(error.message);
	}
};

function play(message, song, log) {
	const Discord = require('discord.js');
	const ytdl = require("ytdl-core");
	const queue = message.client.queue;
	const guild = message.guild;
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.play(ytdl(song.url), {
		quality: 'highestaudio',
		highWaterMark: 1024 * 1024 * 10
	})
		.on("start", () => {
			message.client.user.setActivity(serverQueue.songs[0].title, { type: 'STREAMING' });
			//message.client.user.setPresence({ game: { name: `${serverQueue.songs[0].title}`, type: 0 } });
		})
		.on("finish", () => {
			serverQueue.songs.shift();
			message.client.user.setPresence({ game: null });
			log.info(serverQueue.songs[0].title);
			return play(message, serverQueue.songs[0], log);
		})
		.on("error", error => {
			serverQueue.voiceChannel.leave();
			serverQueue.connection.dispatcher.destroy();
			queue.delete(message.guild.id);
			log.error(error);
			return;
		});
	dispatcher.setVolume(serverQueue.volume / 100);
	serverQueue.textChannel.send(`Now playing: **${song.title}**`);
}