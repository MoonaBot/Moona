const { EmbedBuilder } = require('discord.js');
const prettyBytes = require("pretty-bytes");

module.exports = {
    name: ["stats","lavalink"], // The name of the command
    description: "Display the Lavalink stats", // The description of the command (for help text)
    category: "Developer",
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: true,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false});
        // owner only
        if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `LavaLink`, iconURL: interaction.guild.iconURL({ forceStatic: true })})
            .setThumbnail(client.user.displayAvatarURL({ forceStatic: true, size: 2048 }))
            .setTimestamp()

        client.moon.nodes.forEach((node) => {
            try {
                embed.addFields({ name: "Name", value: `${node.host}` })
                embed.addFields({ name: "Connected", value: `${node.connected ? "Connected [🟢]" : "Disconnected [🔴]"}` })
                embed.addFields({ name: "Player", value: `${node.stats.players}` })
                embed.addFields({ name: "Used Players", value: `${node.stats.playingPlayers}` })
                embed.addFields({ name: "Uptime", value: `<t:${verifyTimestamp(Date.now() - node.stats.uptime)}:R>` })
                embed.addFields({ name: "Cores", value: `${node.stats.cpu.cores + " Core(s)"}` })
                embed.addFields({ name: "Memory Usage", value: `${prettyBytes(node.stats.memory.used)} / ${prettyBytes(node.stats.memory.reservable)}` })
                embed.addFields({ name: "System Load", value: `${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%` })
                embed.addFields({ name: "Lavalink Load", value: `${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%` })
                embed.setFooter({ text: "v"+node.version });
            } catch (e) {
                console.log(e);
            }
        });

        return interaction.editReply({ embeds: [embed] });
    }
}