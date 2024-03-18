const { EmbedBuilder } = require('discord.js');
const ButtonPage = require('../../utils/ButtonPage.js');
const prettyBytes = require("pretty-bytes");
const { request } = require("undici");

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
        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        // owner only
        if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });

        var pages = [];

        client.moon.nodes.map.forEach(node => {
            pages.push(
                new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: 'Lavalink Stats' })
                .setThumbnail(client.user.displayAvatarURL({ forceStatic: true, size: 1024 }))
                .setTitle(`${node.identifier} [\`${node.state === "READY" ? "🟢" : "🔴"}\`]`)
                .setDescription(`v4.0.4`)
                .addFields({ name: "Uptime", value: `<t:${verifyTimestamp(Date.now() - node.stats.uptime)}:R>`, inline:true })
                .addFields({ name: "Player", value: `${node.stats.playingPlayers} / ${node.stats.players}`, inline:true })
                .addFields({ name: "Memory Usage", value: `${prettyBytes(node.stats.memory.used)} / ${prettyBytes(node.stats.memory.reservable)}`, inline:true })
                .addFields({ name: "CPU Cores", value: `${node.stats.cpu.cores + " Core(s)"}`, inline:true })
                .addFields({ name: "System Load", value: `${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%`, inline:true })
                .addFields({ name: "Lavalink Load", value: `${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`, inline:true })
            );
        });

        return ButtonPage.execute(interaction, pages);
    }
}