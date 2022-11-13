const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const SteamAPI = require("steamapi");
const { steamID64 } = require("../config.json");

const Sequelize = require("sequelize");
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "database.sqlite",
});

const Games = sequelize.define("Games", {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  playtime: Sequelize.TEXT,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("showtrack")
    .setDescription("track playtime of a Game"),
  async execute(interaction) {
    //#region gameTitle

    const gameList = await Games.findAll({ attributes: ["name"] });
    const tagString = gameList.map((t) => t.name).join(", ") || "No tags set.";
    await interaction.reply(`List of tags: ${tagString}`);
  },
};
