const Discord = require("discord.js");
const config = require("./config.json");

const commands = {
    "ping": async (bot, message) => {
        message.channel.send(`Pong! ${bot.ping}ms`);
    },

    "help": async (bot, message) => {
        const embed = new Discord.RichEmbed()
            .setColor(config.embed_color)
            .setTitle("My Commands")
            .addField("help", "Shows this message.")
            .addField("games <page> <user>", "Shows your or another user's game playtimes. If user isn't provided or not found, it defaults to you.")
            .addField("ignore", "Toggles playtime tracking. On by default. When toggling to off, your data will be deleted.")
            .addField("invite", "Gives you the link to add the bot to your server.")
            .setFooter(`My prefix is @${bot.user.username}`);

        message.channel.send({embed});
    },

    "games": async (bot, message, page, user) => {
        let target = await bot.user_convert(user);
        if (!target) {
            target = message.author;
        }

        target_games = bot.games.get(target.id);
        if (!target_games) {
            message.channel.send(`${message.author.username}#${message.author.discriminator} | I don't have any data for ${target.username}#${target.discriminator}`);
            return;
        }

        page = ~~page - 1;
        let pages = await bot.tabulate_games(target_games);

        if (pages.length === 0) {
            message.channel.send(`${message.author.username}#${message.author.discriminator} | I don't have any data for ${target.username}#${target.discriminator}`);
            return;
        }

        if (page < 0 || page > pages.length - 1) {
            page = 0;
        }

        let page_text = pages[page];
        page_text += `\n\n${"-".repeat(22)}\nShowing Page ${page + 1} of ${pages.length}\n\`\`\``;
        message.channel.send(page_text);
    },

    "ignore": async (bot, message) => {
        let ignored = bot.ignored.get(message.author.id);
        if (!ignored) {
            bot.ignored.set(message.author.id, true);
            bot.games.delete(message.author.id);
            bot.tracked.delete(message.author.id);
            message.channel.send(`${message.author.username}#${message.author.discriminator} | ` +
                                 "I will no longer track your game playtimes.");
        } else {
            bot.ignored.delete(message.author.id);
            message.channel.send(`${message.author.username}#${message.author.discriminator} | ` +
                                 "I will now track your game playtimes.");
        }
    },

    "invite": async (bot, message) => {
        message.channel.send(`<https://discordapp.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=18432&scope=bot>`);
    }
};

module.exports = commands;