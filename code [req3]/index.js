// Require the necessary discord.js classes
require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const SteamAPI = require('steamapi');
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

const client = new Client({
	intents: [
	  GatewayIntentBits.Guilds,
	  GatewayIntentBits.GuildMessages,
	  GatewayIntentBits.MessageContent,
	],
  });
// Create a new client instance
client.commands = new Collection();

//first path.join helps to construct a path to the commnds dir
const commandsPath = path.join(__dirname, "commands");


const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

//retrieve command files dynamically
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}
//get game hours on specific game
request('https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+steamapi+'&include_played_free_games=1&steamid='+id, function (error, response, body) {
    if(error){
        console.log(error); 
    }else 
	{
        var obj = JSON.parse(body);
        if(isNaN(obj.response.games) || obj.response.games == null)
		{
            console.log('User has private game hour.');
            return;
        }else{
            var games = obj.response.games;
            for (var i = 0; i < games.length; i++) 
			{
                if(games[i].appid == "440")
				{
                    var hours = Math.trunc(games[i].playtime_forever/60);
                    var minutes = games[i].playtime_forever % 60;
                    console.log('time: '+hours+' hours, '+minutes+' minutes.');
                }
            }
		}
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isAutocomplete()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
	  console.error(`No command matching ${interaction.commandName} was found.`);
	  return;
	}
  
	try {
	  await command.autocomplete(interaction);
	} catch (error) {
	  console.error(error);
	}
  });
  //#endregion
  
  client.on(Events.InteractionCreate, async (interaction) => {

	if (!interaction.isChatInputCommand()) return;
  
	const command = interaction.client.commands.get(interaction.commandName);
  
	if (!command) {
	  console.error(`No command matching ${interaction.commandName} was found.`);
	  return;
	}
  
	try {
	  await command.execute(interaction);
	} catch (error) {
	  console.error(error);
	  await interaction.reply({
		content: "There was an error while executing this command!",
		ephemeral: true,
	  });
	}
  });
// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", message => {
	if (message.content.startsWith(">")){
		if (message.content.substring(1) === "Hello") {
			message.reply("Hello!");
		}
	}
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);