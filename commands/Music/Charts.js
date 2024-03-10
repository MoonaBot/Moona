const { EmbedBuilder, ApplicationCommandOptionType, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const Chart = require("../../settings/models/GuildChart.js");
const GChart = require("../../settings/models/GlobalChart.js");
const Canvas = require("@napi-rs/canvas");

const path = require("node:path");
const fontsPath = path.resolve("assets/fonts/Rubik-Regular.ttf");
Canvas.GlobalFonts.registerFromPath(fontsPath, "Rubik");

module.exports = {
    name: ["chart"], // The name of the command
    description: "Display Top 5 Songs of the (global/server)", // The description of the command (for help text)
    category: "Music",
    options: [
        {
            name: 'global',
            description: 'Top 5 Songs of the global',
            type: ApplicationCommandOptionType.Subcommand,
            required: true,
        },
        {
            name: 'server',
            description: 'Top 5 Songs on this server',
            type: ApplicationCommandOptionType.Subcommand,
            required: true,
        }
    ],
    permissions: {
        channel: [],
        bot: ["AttachFiles"],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false});

        const choice = interaction.options.getSubcommand();

        const canvas = Canvas.createCanvas(1000, 625);
		const ctx = canvas.getContext('2d');

        const placer = await Canvas.loadImage("./assets/images/chart.png");
        ctx.drawImage(placer, 5, 5, canvas.width, canvas.height);

        if (choice = "global") {
            const database = await GChart.find({}).sort({ track_count: -1 }).limit(5);

            // draw black blur background
            ctx.fillStyle = '#000001';
            ctx.globalAlpha = 0.5;
            ctx.fillRect(20, 250, 955, 350);
            ctx.globalAlpha = 1;

            // draw black blur avatar
            ctx.fillStyle = '#000001';
            ctx.globalAlpha = 0.5;
            ctx.fillRect(20, 20, 215, 215);
            ctx.globalAlpha = 1;

            ctx.font = 'bold 35px Rubik';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('TOP 5 SONGS | Global', 250, 140);

            ctx.font = '30px Rubik';
            ctx.fillStyle = '#ffffff';
  
            database.map((d, i) => {
                // title don't exceeds canvas height
                try {
                    if (ctx.measureText(d.track_title).width > 700) {
                        const title = d.track_title.substring(0, 50);
                        ctx.fillText(`#${i + 1} | ${d.track_count}x • ${title}...`, 50, 320 + (i * 60));
                    } else {
                        ctx.fillText(`#${i + 1} | ${d.track_count}x • ${d.track_title}`, 50, 320 + (i * 60));
                    }
                } catch (e) {
                    ctx.fillText('No data found', 30, 320 + (i * 60));
                }
            });

            /*ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            // stoke style bold
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#000001';
            ctx.stroke();
            ctx.closePath();
            ctx.clip();*/

            const avatar = await Canvas.loadImage(client.user.displayAvatarURL({ forceStatic:true, size: 1024, format: 'png' }));
            ctx.drawImage(avatar, 30, 30, 195.5, 195.5);

            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'global-chart.png' });

            return interaction.editReply({ files: [attachment] });

        } else if (choice = "guild") {
            const database = await Chart.findOne({ guildId: interaction.guild.id });
            // object
            if (!database) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: 'TOP 5 SONGS | Guild', iconURL: interaction.guild.iconURL() })
                    .setThumbnail(interaction.guild.iconURL({ forceStatic: true }))
                    .setColor(client.color)
                    .setDescription('No data found')
                return interaction.editReply({ embeds: [embed] });
            }
            // sort
            const sorted = database.playedHistory.sort((a, b) => b.track_count - a.track_count);
            // 10 
            const top10 = sorted.slice(0, 5);

            // draw black blur background
            ctx.fillStyle = '#000001';
            ctx.globalAlpha = 0.5;
            ctx.fillRect(20, 250, 955, 350);
            ctx.globalAlpha = 1;

            // draw black blur avatar
            ctx.fillStyle = '#000001';
            ctx.globalAlpha = 0.5;
            ctx.fillRect(20, 20, 215, 215);
            ctx.globalAlpha = 1;

            ctx.font = 'bold 35px Rubik';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`TOP 5 SONGS | ${interaction.guild.name.length > 20 ? interaction.guild.name.substring(0, 17)+"..." : interaction.guild.name}`, 250, 140);

            ctx.font = '30px Rubik';
            ctx.fillStyle = '#ffffff';
            // desc
            top10.map((d, i) => {
                // font exceeds canvas height
                if (ctx.measureText(d.track_title).width > 700) {
                    const title = d.track_title.substring(0, 50);
                    ctx.fillText(`#${i + 1} | ${d.track_count}x • ${title}...`, 50, 320 + (i * 60));
                } else {
                    ctx.fillText(`#${i + 1} | ${d.track_count}x • ${d.track_title}`, 50, 320 + (i * 60));
                }
            });

            /*ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            // stoke style bold
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#000001';
            ctx.stroke();
            ctx.closePath();
            ctx.clip();*/

            const avatar = await Canvas.loadImage(interaction.guild.iconURL({ forceStatic: true, size: 1024, format: 'png' }) || "https://media.discordapp.net/attachments/1010784573061349496/1070283756100911184/question.png");
            ctx.drawImage(avatar, 30, 30, 195.5, 195.5);

            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'server-chart.png' });

            return interaction.editReply({ files: [attachment] });

        }
    },
}
