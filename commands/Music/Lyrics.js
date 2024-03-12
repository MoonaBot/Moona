const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["lyrics"],
    description: "Search for song lyrics by title",
    category: "Music",
    options: [
        {
            name: "search",
            description: "The song title you want to search",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: true,
        isOwner: false,
        inVoice: false,
        sameVoice: true,
    },
    run: async (interaction, client, user, language, player) => {
        await interaction.deferReply({ ephemeral: false });

        const CurrentSong = player.queue.current;

        let value = interaction.options.getString("search");
        let songs = null;
        if (!value && CurrentSong) {
            value = CurrentSong.title;
            songs = await client.ytm.getSong(CurrentSong.identifier);
        } else {
            songs = (await client.ytm.searchSongs(value))[0];
        }
        let lyrics = null;

        try {
            lyrics = await client.ytm.getLyrics(songs.videoId);
            if (!lyrics[0]) return interaction.editReply(`${client.i18n.get(language, "music", "lyrics_notfound")}`);
        } catch (err) {
            console.log(err);
            return interaction.editReply(`${client.i18n.get(language, "music", "lyrics_notfound")}`);
        }

        lyrics = lyrics.map(text => text).join("\n");

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: songs.artist.name })
            .setTitle(songs.name)
            .setThumbnail(songs.thumbnails[1].url)//(`${client.i18n.get(language, "music", "lyrics_title", { song: value })}`)
            .setDescription(lyrics)
            .setFooter({ text: `Provided by ${client.user.username} Bot Lyrics`, iconURL: client.user.displayAvatarURL({ forceStatic: true }) })
            //.setTimestamp();

        if (lyrics.length > 4096) {
            embed.setDescription(lyrics.substring(0, 4096-3)+"...");
        }

        return interaction.editReply({ embeds: [embed] });
    }
}
