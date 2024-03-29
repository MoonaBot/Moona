const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../utils/ConvertTime.js");
const Playlist = require("../../settings/models/Playlist.js");

const tracks = [];

module.exports = {
    name: ["playlist", "add"],
    description: "Add song to a playlist",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true
        },
        {
            name: "song",
            description: "The song to add",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: true,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const name = interaction.options.getString("name");
        const song = interaction.options.getString("song");

        const PName = name.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "import_notfound")}`);

        const res = await client.moon.search({ queey: song, requester: interaction.user });

        if(res.loadType != "empty") {
            if(res.loadType == "track") {
                tracks.push(res.tracks[0]);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "playlist", "add_track", {
                        title: res.tracks[0].title,
                        url: res.tracks[0].url,
                        duration: convertTime(res.tracks[0].duration, true),
                        user: interaction.user
                        })}`)
                    .setColor(client.color)

                interaction.editReply({ embeds: [embed] });
            } else if(res.loadType == "playlist") {
                for (let i = 0; i < res.tracks.length; i++) {
                    tracks.push(res.tracks[i]);
                }

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "playlist", "add_playlist", {
                        title: res.playlist.name,
                        url: song,
                        duration: convertTime(res.playlist.duration),
                        track: res.tracks.length,
                        user: interaction.user
                        })}`)
                    .setColor(client.color)

                interaction.editReply({ embeds: [embed] });
            } else if(res.loadType == "search") {
                tracks.push(res.tracks[0]);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "playlist", "add_search", {
                        title: res.tracks[0].title,
                        url: res.tracks[0].url,
                        duration: convertTime(res.tracks[0].duration, true),
                        user: interaction.user
                        })}`)
                    .setColor(client.color)

                interaction.editReply({ embeds: [embed] });
            } else if (res.loadType == "loadfailed") { //Error loading playlist.
                return interaction.editReply(`${client.i18n.get(language, "playlist", "add_fail")}`);
            }
        } else { //The playlist link is invalid.
            return interaction.editReply(`${client.i18n.get(language, "playlist", "add_match")}`);
        }

        Playlist.findOne({ name: PName }).then(playlist => {
            if(playlist) {
                if(playlist.owner !== interaction.user.id) { 
                    interaction.followUp(`${client.i18n.get(language, "playlist", "add_owner")}`); 
                    tracks.length = 0; 
                    return; 
                }

                const LimitTrack = playlist.tracks.length + tracks.length;

                if(LimitTrack > client.config.LimitTrack) { 
                    interaction.followUp(`${client.i18n.get(language, "playlist", "add_limit_track", {
                        limit: client.config.LimitTrack
                    })}`); 
                    tracks.length = 0; 
                    return; 
                }

                for (let i = 0; i < tracks.length; i++) {
                    playlist.tracks.push(tracks[i]);
                }

                playlist.save().then(() => {
                    const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "playlist", "add_added", {
                            count: tracks.length,
                            playlist: PName
                            })}`)
                        .setColor(client.color)
                    interaction.followUp({ content: " ", embeds: [embed] });
                tracks.length = 0;
                });
            }
        });
    }
}