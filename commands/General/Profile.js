const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const moment = require('moment');
const Premium = require("../../settings/models/Premium.js");
const Profile = require("../../settings/models/Profile.js");
const Canvas  = require("@napi-rs/canvas");

const path = require("node:path");
const fontsPath = path.resolve("assets/fonts/Rubik-Regular.ttf");
Canvas.GlobalFonts.registerFromPath(fontsPath, "Rubik");

module.exports = {
    name: ["profile"],
    description: "View user profile stats",
    category: "General",
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    options: [{
        name: "user",
        description: "Select the user whose profile you want to view",
        type: ApplicationCommandOptionType.User
    }],
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        let target = interaction.options.getUser("user");

        if (!user) user = interaction.user;
        const info = await Premium.findOne({ Id: target.id });
        const timeLeft = moment.duration(info.premium.expiresAt - Date.now()).format("d [days], h [hours], m [minutes]");
        const profile = await Profile.findOne({ userId: target.id });
        const listenTime = moment.duration(profile.listenTime).format("d[d] h[h] m[m]");

        const canvas = Canvas.createCanvas(1000, 625);
		const ctx = canvas.getContext('2d');

        const placer = await Canvas.loadImage("./assets/images/chart.png");
        ctx.drawImage(placer, 5, 5, canvas.width, canvas.height);

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

        const username = target.globalName ? (target.globalName.length > 18 ? target.globalName.substring(0, 15)+'...' : target.globalName) : (target.username.length > 18 ? target.username.substring(0, 15)+'...' : target.username);

        /*ctx.fillStyle = '#000001';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(250, 60, 100 + ctx.measureText(plan).width, 60);
        ctx.globalAlpha = 1;*/

        ctx.font = 'bold 55px Rubik';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(username, 250, 70+70);

        /*let listen = "";

        if (profile.listenTime === 0) {
            listen = "No Listen Time";
        } else {
            listen = listenTime;
        }

        let plan = "";
        let expire = "";

        if (info.premium.plan === "lifetime") {
            plan = toOppositeCase(info.premium.plan);
            expire = "Unlimited";
        } else {
            plan = toOppositeCase(info.premium.plan || "FREE");
            if (info.premium.expiresAt < Date.now()) {
                expire = "Never Expired";
            } else {
                expire = timeLeft;
            }
        }

        ctx.font = 'bold 30px Rubik';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(plan, 250.5, 110);

        ctx.font = '30px Rubik';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Songs Played: ${profile.playedCount.toLocaleString().replaceAll(",", ".")}x`, 250, 150);

        ctx.font = '30px Rubik';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Commands Used: ${profile.useCount.toLocaleString().replaceAll(",", ".")}x`, 250, 190);

        ctx.font = '30px Rubik';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Total Played: ${profile.playedCount.toLocaleString().replaceAll(",", ".")}x (${listen})`, 250, 230);*/

        // sort
        const sorted = profile.playedHistory.sort((a, b) => b.track_count - a.track_count);
        // 10 
        const top10 = sorted.slice(0, 5);

        ctx.font = 'bold 30px Rubik';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`TOP 5 SONGS`, 50, 290);

        ctx.font = '30px Rubik';
        ctx.fillStyle = '#ffffff';

        // desc
        top10.map((d, i) => {
            // font exceeds canvas height
            if (ctx.measureText(d.track_title).width > 700) {
                const title = d.track_title.substring(0, 52);
                ctx.fillText(`#${i + 1} | ${d.track_count}x • ${title}...`, 50, 340 + (i * 60));
            } else {
                ctx.fillText(`#${i + 1} | ${d.track_count}x • ${d.track_title}`, 50, 340 + (i * 60));
            }
        });

        ///
        /*ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        // stoke style bold
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#000001';
        ctx.stroke();
        ctx.closePath();
        ctx.clip();*/

        const avatar = await Canvas.loadImage(target.displayAvatarURL({ format: 'png', size: 1024, forceStatic: true }));
        ctx.drawImage(avatar, 30, 30, 195.5, 195.5);

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile.png' });

        return interaction.editReply({ files: [attachment] });
    }
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}