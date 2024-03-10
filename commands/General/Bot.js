const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const bot = require("../../package.json")

const iStatus = {
    "online": "https://cdn.discordapp.com/emojis/689448141774389275.png",
    "idle": "https://cdn.discordapp.com/emojis/689448170307977240.png",
    "dnd": "https://cdn.discordapp.com/emojis/689448200406302765.png",
    "invisible": "https://cdn.discordapp.com/emojis/695461329800134696.png"
};

module.exports = {
    name: ["stats", "bot"],
    description: "View a bot stats",
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
    run: async(interaction, client, user, language) => {
    const waitnow = await Date.now();
    await interaction.deferReply('Sedang diproses...');

    const { color } = interaction.client.config;
    const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: `Information Stats`, iconURL: iStatus[interaction.client.presence.status] })
        .setDescription(bot.description)
        .setThumbnail(interaction.client.user.displayAvatarURL({ forceStatic: true, size: 1024 }))
        .addFields([
        { name: "User ID", value: interaction.client.user.id, inline: true },
        { name: "Created On", value: `<t:${int(interaction.client.user.createdTimestamp)}:D>`, inline: true },
        { name: "Developer", value: `[${(await interaction.client.users.fetch(client.config.OWNER_ID)).tag}](https://discord.com/users/${client.config.OWNWER_ID})`, inline: true }
        ])
        .addFields([
        { name: "Latency", value: `Ping **${waitnow - interaction.createdTimestamp}** ms`, inline: true },
        { name: "Guilds", value: interaction.client.guilds.cache.size.toLocaleString().replaceAll(",", ".")+" Server", inline: true },
        { name: "Users", value: (interaction.client.guilds.cache.reduce((members, guild) => members + guild.memberCount, 0)).toLocaleString().replaceAll(",", ".")+" User", inline: true }
        ])
        .addFields({ name: "Uptime", value: `<t:${int(interaction.client.readyTimestamp)}:R>`})
        .setFooter({ text: `Version: ${bot.version} | © 2024 ${interaction.client.user.username} Bot` });

    await interaction.editReply({ content: null, embeds: [embed] });
    }
}

function int(timestamp) {
    return Math.round(timestamp / 1000);
};