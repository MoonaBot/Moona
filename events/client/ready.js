const { ActivityType, ChannelType } = require("discord.js");

const { green, white } = require('chalk');
const Premium = require('../../settings/models/Premium.js');

module.exports = async (client) => {
    await client.manager.init(client.user.id);

    console.log(white('[') + green('INFO') + white('] ') + green(`${client.user.tag} (${client.user.id})`) + white(` is Ready!`));

    const users = await Premium.find();
    for (let user of users) {
      client.premiums.set(user.Id, user);
    }

    const guilds = client.guilds.cache.size;
    const members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    const channels = client.channels.cache.filter(ch => ch.type === ChannelType.GuildStageVoice && ch.type === ChannelType.GuildVoice).size;

    const activity = [
        { name: `/help | ${guilds} Servers`, type: ActivityType.Playing },
        { name: `/play | ${members} Users`, type: ActivityType.Listening },
        { name: `/filter | ${channels} Voice Channels`, type: ActivityType.Watching },
    ];

    setInterval(() => {
        client.user.setPresence({ 
            activities: activity[Math.floor(Math.random() * activity.length)], 
            status: 'online', 
        });
    }, 60000*5);

};
