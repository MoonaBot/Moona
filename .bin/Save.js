const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../settings/models/Playlist.js");

const tracks = [];

module.exports = {
    name: ["playlist", "save"],
    description: "Save the (current/queue) song to a playlist",
    category: "Playlist",
    options: [
        {
            name: "current",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "name",
                description: "The name of the playlist",
                required: true,
                type: ApplicationCommandOptionType.String,
                autocomplete: true
            }],
        },
        {
            name: "queue",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "name",
                description: "The name of the playlist",
                required: true,
                type: ApplicationCommandOptionType.String,
                autocomplete: true
            }],
        }
    ],
    isSubGroup: true,
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: true,
        isPlayer: true,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language, player) => {
        await interaction.deferReply({ ephemeral: false });

        const subCommandGroup = interaction.options.get("save");
        const subCommand = subCommandGroup.options.getSubcommand();
        const name = subCommandGroup.options.get(subCommand).options.getString("name");
        const PName = name.replace(/_/g, ' ');

        if (subCommand === "current") {
        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "savequeue_notfound")}`);
        if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "savequeue_owner")}`);

        const current = player.current;

        tracks.push(current);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "playlist", "savequeue_saved", {
                name: PName,
                tracks: 1
                })}`)
            .setColor(client.color)

        interaction.editReply({ embeds: [embed] });

        playlist.tracks.push(...tracks);

        playlist.save().then(() => {
            tracks.length = 0;
        }); 
        } else {
            const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "savequeue_notfound")}`);
        if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "savequeue_owner")}`);

        const queue = player.queue.map(track => track);
        const current = player.current;

        tracks.push(current);
        tracks.push(...queue);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "playlist", "savequeue_saved", {
                name: PName,
                tracks: queue.length + 1
                })}`)
            .setColor(client.color)

        interaction.editReply({ embeds: [embed] });

        playlist.tracks.push(...tracks);

        playlist.save().then(() => {
            tracks.length = 0;
        });
        }
    }
}