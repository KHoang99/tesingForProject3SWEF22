//main code path for listening to commands and events on the discord bot in a discord server

require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

//#region cmd handling
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

//first path.join helps to construct a path to the commnds dir
const commandsPath = path.join(__dirname, "commands");

//The fs.readdirSync() method then reads the path to the directory
//and returns an array of all the file names
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

//retrieve command files dynamically
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// //optional start up msg on <node .> command
// client.once(Events.ClientReady, () => {
//   console.log("Ready!");
// });

// begginer sample to see the usage of message.content
// client.on("messageCreate", async (message) => {
//   // if (!message?.author.bot) {
//   //   message.reply(`${message.content}`);
//   // }
//   if (message.content == "hi") {
//     message.channel.send("should sent this mesage once");
//     console.log(message.content);
//   }
// });

// begginer sample to see the usage of message.content
// const messageHandler = (message) => {
//   if (message.content == "hi") {
//     message.channel.send("should sent this mesage once");
//     console.log(message.content);
//   }
// };

//instance of interaction handling for autocomplete
//probably a bug in the future using two duplicates of the same code but idk

//#region autocomplete section
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
  /*Not every interaction is a slash command
  //Make sure to only handle slash commands in this function
  //making use of the BaseInteraction#isChatInputCommand 
  //method to exit the handler if another type is encountered
  */
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
//#endregion

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isButton()) return;
  interaction.reply("The button was clicked, do something else");
});

//#region sequelize section

const Sequelize = require("sequelize");
//initializing connection
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  //SQLite only
  storage: "database.sqlite",
});
//Create Table
/**
 * equivalent to: CREATE TABLE tags(
 * name VARCHAR(255) UNIQUE
 * description TEXT,
 * username VARCHAR(255),
 * usage_count  INT NOT NULL DEFAULT 0
 * );
 */
const Games = sequelize.define("Games", {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  playtime: Sequelize.TEXT,
});
// When the client is ready, run this code (only once)
client.once(Events.ClientReady, () => {
  //Testing usage
  // Tags.sync({ force: true });
  Games.sync();
  console.log(`Logged in as ${client.user.tag}!`);
});

//#endregion
//#region logging in
client.login(process.env.DISCORD_TOKEN);

//#endregion
