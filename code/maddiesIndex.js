const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require("./botconfig.json");
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

["aliases", "commands"].forEach(x => client[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handlers/${x}`)(client));

client.on("message", async message => {
    if(message.author.client || message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.toLowerCase(" ")
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd === `${prefix}hello`){
        return message.channel.send("Hello")
    }

})


client.login(token);
