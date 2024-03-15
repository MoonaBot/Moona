const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const CT = require("../../utils/ConvertTime.js");
const Premium = require("../../settings/models/Premium.js");
const Profile = require("../../settings/models/Profile.js");

const { Canvas, loadImage } = require("canvas-constructor/napi-rs");
const { request } = require('undici');

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

        if (!target) target = interaction.user;
        if (target.bot) {
            interaction.channel.send("This bot don't have profile stats... So, i will replace to your profile as default.").then(msg => setTimeout(() => msg.delete(), 7000));
            target = interaction.user;
        }
        const info = await Premium.findOne({ Id: target.id });
        const timeLeft = CT.format(info.premium.expiresAt - Date.now());
        const profile = await Profile.findOne({ userId: target.id });
        const listenTime = CT.format(profile.listenTime);

        const background = await loadImage("./assets/images/chart.png")
            ;
        const radius = { tr: 20, tl: 20, br: 20, bl: 20 };
            
        const canvas = new Canvas(1000, 625);
        canvas.printRoundedImage(background, 0, 0, canvas.width, canvas.height, { tr: 10, tl: 10, br: 10, bl: 10 });
        
        // draw black blur rectangular background
        canvas.setColor('black')
        .setGlobalAlpha(0.5)
        .printRoundedRectangle(20, 250, 955, 350, radius)
        .setGlobalAlpha(1);

        // draw black blur avatar
        canvas.setColor('black')
        .setGlobalAlpha(0.5)
        .printRoundedRectangle(20, 20, 215, 215, radius)
        .setGlobalAlpha(1);

        const username = target.globalName ? (target.globalName.length > 18 ? subText(target.globalName, 15) : target.globalName) : (target.username.length > 18 ? subText(target.username, 15) : target.username);

        /*canvas.setColor('black')
        .setGlobalAlpha(0.5)
        .printRoundedRectangle(250, 60, 100 + ctx.measureText(plan).width, 60, radius)
        .setGlobalAlpha(1);*/

        if (target?.globalName) {
            canvas.setColor('white')
                .setTextFont('55px Rubik-Bold')
                .printText(username, 250, 70+30);
            canvas.setColor('silver')
                .setTextFont('35px Rubik')
                .printText('@'+subText(target.username, 18), 250, 70+70);
        } else {
            canvas.setColor('white')
                .setTextFont('55px Rubik-Bold')
                .printText(username, 250, 70 + 70);
        }

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

        ctx.font = 'bold 30px Rubik-Regular';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(plan, 250.5, 110);

        ctx.font = '30px Rubik-Regular';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Songs Played: ${profile.playedCount.toLocaleString().replaceAll(",", ".")}x`, 250, 150);

        ctx.font = '30px Rubik-Regular';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Commands Used: ${profile.useCount.toLocaleString().replaceAll(",", ".")}x`, 250, 190);

        ctx.font = '30px Rubik-Regular';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Total Played: ${profile.playedCount.toLocaleString().replaceAll(",", ".")}x (${listen})`, 250, 230);*/

        // sort
        const sorted = profile.playedHistory.sort((a, b) => b.track_count - a.track_count);
        // 10 
        const top10 = sorted.slice(0, 5)[0] ? sorted.slice(0, 5) : ["No Data", "No Data", "No Data", "No Data", "No Data"];

        canvas.setColor('white')
        .setTextFont('30px Rubik-Bold')
        .printText(`TOP SONGS`, 40, 290);

        // desc
        var numb = 0;
        top10.map((d, i) => {
            const topcolor = ["blue", "pink", "green", "yellow", "red"];
            // font exceeds canvas height
            canvas.setColor(topcolor[numb++])
                .printRoundedRectangle(40, 300 + (i * 60), 50, 50, radius)
            canvas.setColor("black")
                .setTextFont("30px Rubik")
                .printText((i+1).toString(), 55, 340 + (i * 60))
            if (canvas.measureText(d.track_title).width > 700) {
                let cutLength = 52;
                if (d.track_title === d.track_title.toUpperCase()) {
                    cutLength = cutLength - 7;
                }
                canvas.printText(`(${d.track_count}x) ${subText(d.track_title, cutLength)}`, 95.5, 340 + (i * 60));
            } else {
                canvas.printText(`(${d.track_count}x) ${d.track_title}`, 95.5, 340 + (i * 60));
            }
        });

        const { body } = await request(target.displayAvatarURL({ extension: 'png', size: 1024, forceStatic: true }));
        const avatar = await loadImage(await body.arrayBuffer());
        canvas.printRoundedImage(avatar, 30, 30, 195.5, 195.5, radius);

        const attachment = new AttachmentBuilder(await canvas.png(), { name: 'profile.png' });

        return interaction.editReply({ files: [attachment] });
    }
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}