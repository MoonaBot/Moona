const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["skip"],
    description: "Skip the song currently playing",
    category: "Music",
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    options: [
        {
            name: "to",
            description: "Skip to position of the song in queue list",
            type: ApplicationCommandOptionType.Integer
        },
    ],
    settings: {
        isPremium: false,
        isPlayer: true,
        isOwner: false,
        inVoice: false,
        sameVoice: true,
    },
    run: async (interaction, client, user, language, player) => {
        await interaction.deferReply({ ephemeral: false });
        
        const value = interaction.options.getInteger("to");
        if (value) {
        if (value === 0) return interaction.editReply(`${client.i18n.get(language, "music", "skipto_arg", {
            prefix: "/"
        })}`);

        if ((value > player.queue.length) || (value && !player.queue[value - 1])) return interaction.editReply(`${client.i18n.get(language, "music", "skipto_invalid")}`);
        if (value == 1) player.stop();

        await player.queue.splice(0, value - 1);
        await player.stop();
        await client.clearInterval(client.interval);
        
        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "skipto_msg", {
                position: value
            })}`)
            .setColor(client.color);

        return interaction.editReply({ embeds: [embed] });
    }
        if (player.queue.size == 0) {
            await player.destroy();
            await client.UpdateMusic(player);
            await client.clearInterval(client.interval);

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                .setColor(client.color);
    
            return interaction.editReply({ embeds: [embed] });
        } else {
            await player.stop();
            await client.clearInterval(client.interval);

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                .setColor(client.color);
    
            return interaction.editReply({ embeds: [embed] });
        }
    }
}