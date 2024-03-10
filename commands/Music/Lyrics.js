const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const lyricsfinder = require('lyrics-finder');

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

        let value = interaction.options.getString("result");
        let CurrentSong = player.queue.current;
        if (!value && CurrentSong) value = CurrentSong.title;

        let lyrics = null;

        try {
            lyrics = await lyricsfinder(value, "");
            if (!lyrics) return interaction.editReply(`${client.i18n.get(language, "music", "lyrics_notfound")}`);
        } catch (err) {
            console.log(err);
            return interaction.editReply(`${client.i18n.get(language, "music", "lyrics_notfound")}`);
        }

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`${client.i18n.get(language, "music", "lyrics_title", {
                song: value
            })}`)
            .setDescription(`${lyrics}`)
            .setFooter({ text: `Requested by ${interaction.user.username}`})
            .setTimestamp();

        if (lyrics.length > 4096) {
            embed.data.description(`${client.i18n.get(language, "music", "lyrics_toolong")}`);
        }

        return interaction.editReply({ embeds: [embed] });
    }
}
