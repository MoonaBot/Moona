const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["clear"],
    description: "Clear all songs in the queue",
    category: "Music",
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

        await player.queue.clear();
        
        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "clearqueue_msg")}`)
            .setColor(client.color);
            
        return interaction.editReply({ embeds: [embed] });
    }
}