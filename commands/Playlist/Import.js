const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../utils/ConvertTime.js");
const Playlist = require("../../settings/models/Playlist.js");

module.exports = {
    name: ["playlist", "import"],
    description: "Import a playlist to queue.",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true
        }
    ],
    permissions: {
        channel: ["Speak", "Connect"],
        bot: ["Speak", "Connect"],
        user: []
    },
    settings: {
        isPremium: true,
        isPlayer: false,
        isOwner: false,
        inVoice: true,
        sameVoice: false,
    },
    run: async (interaction, client, user, language, player) => {
        await interaction.deferReply({ ephemeral: false });

        const name = interaction.options.getString("name");

        const PName = name.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "import_notfound")}`);
        if(playlist.private && playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "import_private")}`);

        if(!player) {
            player = await client.moon.players.create({
                guildId: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
            });

            if (!player.connected) await player.connect({ setDeaf: true });
        }

        const tracks = [];
        let tracks_length = 0;
        const totalDuration = convertTime(playlist.tracks.reduce((acc, cur) => acc + cur.duration, 0));

        const embed = new EmbedBuilder() // **Imported • \`${PName}\`** (${playlist.tracks.length} tracks) • ${interaction.user}
            .setDescription(`${client.i18n.get(language, "playlist", "import_imported", {
                name: PName,
                tracks: playlist.tracks.length,
                duration: totalDuration,
                user: interaction.user
            })}`)
            .setColor(client.color)

        interaction.editReply({ embeds: [embed] });

        for (let i = 0; i < playlist.tracks.length; i++) {
            const res = await client.moon.search({ query: playlist.tracks[i].url, requester: interaction.user });
            if(res.loadType != "empty") {
                if(res.loadType == "track") {
                    tracks.push(res.tracks[0]);
                    tracks_length++;
                } else if(res.loadType == "playlist") {
                    for (let t = 0; t < res.playlist.tracks.length; t++) {
                        tracks.push(res.playlist.tracks[t]);
                        tracks_length++;
                    }
                } else if(res.loadType == "search") {
                    tracks.push(res.tracks[0]);
                    tracks_length++;
                } else if(res.loadType == "loadfailed") {
                    interaction.channel.send(`${client.i18n.get(language, "playlist", "import_fail")}`); 
                    player.destroy(); 
                    return;
                }
            } else {
                interaction.channel.send(`${client.i18n.get(language, "playlist", "import_match")}`); 
                player.destroy(); 
                return;
            }

            if(tracks_length == playlist.tracks.length) {
                player.queue.add(tracks);
                if (!player.playing)  player.play(); 
            }
        }
    }
}