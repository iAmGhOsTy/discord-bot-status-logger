require("http").createServer((req, res) => res.end("bot is live")).listen(process.env.PORT || 8080)
require('dotenv').config();
const colors = require("colors");
const moment = require("moment");
const { PresenceUpdateStatus } = require("discord-api-types/v9");
const { Presence } = require("discord.js");
const config = require('./config.json')
const { Client ,Intents, MessageEmbed } = require("discord.js");
const client = new Client({
    shards: 'auto',
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ],
    presence: {
        activities: [{
            name: `presence name`,
            type: "type", // watching, playing, listening, competing
        }],
        status: "status" // online, dnd, idle, invisible
    }
});
client.on("presenceUpdate", async (oldPresence, newPresence) => {
  try
    {
        if (!oldPresence || !oldPresence.user.bot)
            return;
        if (oldPresence.status == newPresence.status)
            return;

        if (config.Servers)
        {
/* when bot is online */
            if (newPresence.status == PresenceUpdateStatus.Online)
            {
                newPresence.guild.channels.cache.get(config.Channels).send({
                    embeds: [new MessageEmbed()
                    .setTitle(`🟢︱Uptime Alert`)
                    .setDescription(`Looks like **${newPresence.user.tag}** is back **Online! **`)
                    
                    .setColor(`GREEN`)
                    .setThumbnail(newPresence.user.avatarURL({ format: "png", size: 1024 }))
                    .setFooter({name:`Uptime Alert`, iconURL: `${newPresence.user.avatarURL({format: "png", size: 1024})}`})
                    .setTimestamp()]
                });
            }

            /* when bot is offline */
            else if (newPresence.status == PresenceUpdateStatus.Offline || newPresence.status == PresenceUpdateStatus.Invisible)
            {
                newPresence.guild.channels.cache.get(config.Channels).send({
                    embeds: [new MessageEmbed()
                    .setTitle(`🔴︱Downtime Alert`)
                    .setDescription(`Looks like **${newPresence.user.tag}**went **Offline! **`)
                    .setColor(`RED`)
                    .setThumbnail(newPresence.user.avatarURL({ format: "png", size: 1024 }))
                    .setFooter({name:`Downtime Alert`, iconURL: `${newPresence.user.avatarURL({format: "png", size: 1024})}`})
                    .setTimestamp()]
                });
            }
        }
    }
    catch (err)
    {
        return Promise.reject(err);
    }
});

client.login(process.env.TOKEN);

client.logger = (data) => {
  let logstring = `${String(`M` + `i` + `l` + `a` + `n` + `i` + `o` + ` Logs`).brightGreen}${` | `.grey}${`${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")}`.cyan}${` [::] `.magenta}`
  if (typeof data == "string") {
    console.log(logstring, data.split("\n").map(d => `${d}`.green).join(`\n${logstring} `))
  } else if (typeof data == "object") {
    console.log(logstring, JSON.stringify(data, null, 3).green)
  } else if (typeof data == "boolean") {
    console.log(logstring, String(data).cyan)
  } else {
    console.log(logstring, data)
  }
};

client.on("ready", async () => {
  try{
      client.logger(`Bot is online!`.bold.brightGreen);
      
      client.logger(
      `Bot: `.brightBlue + `${client.user.tag}`.blue + `\n` +
      `Servers: `.brightBlue + `${client.guilds.cache.size} Servers`.blue + `\n` +
      `User: `.brightBlue + `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`.blue + `\n` +
      `Discord.js: `.brightBlue + `v${Discord.version}`.blue + `\n` +
      `Node.js: `.brightBlue + `${process.version}`.blue + `\n` +
      `Plattform: `.brightBlue + `${process.platform} ${process.arch}`.blue + `\n` +
      `Memory: `.brightBlue + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`.blue
      );
    }catch{ /* */ }
});


process.on('multipleResolves', (type, promise, reason) => { 
  console.log('[antiCrash] :: [multipleResolves]');
  console.log(type, promise, reason);
});
process.on('unhandledRejection', (reason, promise) => { 
  console.log('[antiCrash] :: [unhandledRejection]');
  console.log(promise, reason);
});
process.on("uncaughtException", (err, origin) => { 
  console.log('[antiCrash] :: [uncaughtException]');
  console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => { 
  console.log('[antiCrash] :: [uncaughtExceptionMonitor]');
  console.log(err, origin);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
