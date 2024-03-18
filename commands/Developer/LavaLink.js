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

        client.moon.nodes.map.forEach((node) => {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: 'Lavalink Stats' })
                .setThumbnail(client.user.displayAvatarURL({ forceStatic: true, size: 1024 }));
            try {
                embed.setTitle(`${node.identifier} [\`${node.state === "READY" ? "🟢" : "🔴"}\`]`)
                embed.setDescription(`v4.0.4`)
                embed.addFields({ name: "Uptime", value: `<t:${verifyTimestamp(Date.now() - node.stats.uptime)}:R>`, inline:true })
                embed.addFields({ name: "Player", value: `${node.stats.playingPlayers} / ${node.stats.players}`, inline:true })
                embed.addFields({ name: "Memory Usage", value: `${prettyBytes(node.stats.memory.used)} / ${prettyBytes(node.stats.memory.reservable)}`, inline:true })
                embed.addFields({ name: "CPU Cores", value: `${node.stats.cpu.cores + " Core(s)"}`, inline:true })
                embed.addFields({ name: "System Load", value: `${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%`, inline:true })
                embed.addFields({ name: "Lavalink Load", value: `${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`, inline:true })
            } catch (e) {
                console.log(e);
            }
            pages.push(embed);
        });

        return ButtonPage.execute(interaction, pages);
    }
}