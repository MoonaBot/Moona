const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["loop"],
    description: "Select the loop mode you want, default is",
    category: "Music",
    options: [
        {
            name: "current",
            description: "Looping the current song",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "queue",
            description: "Looping all songs in the queue",
            type: ApplicationCommandOptionType.Subcommand
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

        const choice = interaction.options.getSubcommand();
 
        if(choice === "current") {
            if (player.trackRepeat === false) {
                await player.setTrackRepeat(true);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "loop_current")}`)
                    .setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            } else {
                await player.setTrackRepeat(false);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "unloop_current")}`)
                    .setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            }
        } else if(choice === "queue") {
            if (player.queueRepeat === true) {
                await player.setQueueRepeat(false);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "unloop_all")}`)
                    .setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            } else {
                await player.setQueueRepeat(true);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "loop_all")}`)
                    .setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            }
        }
    }
}
