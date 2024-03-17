const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../utils/ConvertTime.js");

module.exports = {
    name: ["play"], // I move play to main issues subcmd (max 25)
    description: "Play music in your voice channel",
    category: "Music",
    options: [
        {
            name: "song",
            description: "The song you want to play",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
    ],
    permissions: {
        channel: ["Speak", "Connect"],
        bot: ["Speak", "Connect"],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: true,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        try {
            if (interaction.options.getString("song")) {
                await interaction.deferReply({ ephemeral: false });

                const value = interaction.options.get("song").value;

                const player = client.moon.players.create({
                    guildId: interaction.guild.id,
                    voiceChannel: interaction.member.voice.channel.id,
                    textChannel: interaction.channel.id,
                });
                
                if (!player.connected) await player.connect({ setDeaf: true });
                const res = await client.moon.search({ query: value, requester: interaction.user });

                if(res.loadType != "empty") {
                    if(res.loadType == "track") {
                        await player.queue.add(res.tracks[0]);

                        const embed = new EmbedBuilder()
                            .setDescription(`${client.i18n.get(language, "music", "play_track", {
                                title: subText(res.tracks[0].title, 70),
                                url: res.tracks[0].uri,
                                duration: convertTime(res.tracks[0].duration, true),
                                request: res.tracks[0].requester
                            })}`)
                            .setColor(client.color)

                        interaction.editReply({ content: " ", embeds: [embed] });
                        if(!player.playing) player.play();
                    } else if(res.loadType == "playlist") {
                        await player.queue.add(res.tracks)

                        const embed = new EmbedBuilder()
                            .setDescription(`${client.i18n.get(language, "music", "play_playlist", {
                                title: res.playlist.name,
                                url: value,
                                duration: convertTime(res.playlist.duration),
                                songs: res.tracks.length,
                                request: res.tracks[0].requester
                            })}`)
                            .setColor(client.color)

                        interaction.editReply({ content: " ", embeds: [embed] });
                        if(!player.playing) player.play();
                    } else if(res.loadType == "search") {
                        await player.queue.add(res.tracks[0]);

                        const embed = new EmbedBuilder()
                            .setDescription(`${client.i18n.get(language, "music", "play_result", {
                                title: subText(res.tracks[0].title, 70),
                                url: res.tracks[0].uri,
                                duration: convertTime(res.tracks[0].duration, true),
                                request: res.tracks[0].requester
                            })}`)
                            .setColor(client.color)

                        interaction.editReply({ content: " ", embeds: [embed] });
                        if(!player.playing) player.play();
                    } else if(res.loadType == "loadfailed") {
                        interaction.editReply(`${client.i18n.get(language, "music", "play_fail")}`); 
                        player.destroy();
                    }
                } else {
                    interaction.editReply(`${client.i18n.get(language, "music", "play_match")}`); 
                    player.destroy();
                }
            }
        } catch (error) {
            //
        }
    }
}
