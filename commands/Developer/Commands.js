const { EmbedBuilder } = require('discord.js');
const Useable = require("../../settings/models/CommandStats.js");

module.exports = {
    name: ["stats","command"], // The name of the command
    description: "Display Top 10 commands used stats", 
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

        const database = await Useable.find({}).sort({ count: -1 }).limit(10);

        if (!database) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription('No data found')

            return interaction.editReply({ embeds: [embed] });
        }

        const desc = database.map((d, i) => `${i + 1}. \`${toOppositeCase(d.name)}\` | \`${d.count.toLocaleString().replaceAll(",", ".")}\``).join('\n'); //

        const embed = new EmbedBuilder()
            //.setAuthor({ name: 'Top 10 Commands Used', iconURL: client.user.displayAvatarURL() })
            .setTitle("Top 10 Command Popularity")
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(client.color)
            .setDescription(desc);

        return interaction.editReply({ embeds: [embed] });
    }
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}