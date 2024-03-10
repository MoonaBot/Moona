const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    name: ["ping"],
    description: "Responding to delays in ms",
    category: "General",
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async(interaction, client) => {
        const timestamp = await Date.now();
        await interaction.reply({ content: "Pinging...", ephemeral: true });

        await interaction.editReply(`Pong! **${timestamp - interaction.createdTimestamp}** ms`);
        return;
    }
}