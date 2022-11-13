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
  playtime: Sequelize.NUMBER,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trackplaytime")
    .setDescription("track playtime of a Game")
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("Game Detail Based on Autocomplete")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction, client) {
    //move this up
    async function steam_summaryforAutoComplete() {
      const steam = new SteamAPI(process.env.STEAM_TOKEN);
      var gamesData = await steam.getUserOwnedGames(steamID64);
      return gamesData;
    }
    var gameList = await steam_summaryforAutoComplete();

    let choices = gameList.slice(0, 22).map((a) => a.name);

    const focusedValue = interaction.options.getFocused();
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction) {
    async function handleError(e) {
      if (e.response) {
        await interaction.reply(`Server Error: ${e}`);
      } else if (e.request) {
        await interaction.reply(`Nework Error: ${e}`);
      } else {
        await interaction.reply(`Client Error: ${e}`);
      }
    }

    const game = interaction.options.getString("game");
    async function steam_summary() {
      try {
        const steam = new SteamAPI(process.env.STEAM_TOKEN);
        var gamesData = await steam.getUserOwnedGames(steamID64);
        return gamesData;
      } catch (err) {
        await handleError(err);
      }
    }
    var gamesList = await steam_summary();
    if (!gamesList) {
      return;
    }

    const gameDetail = gamesList.find(({ name }) => name === game);
    let gameDetailArr = [];
    gameDetailArr.push({
      name: `${gameDetail.name}`,
      playtime: `${gameDetail.playTime}`,
      iconURL: `${gameDetail.iconURL}`,
      appID: `${gameDetail.appID}`,
    });

    const gameObj = await Games.create({
      name: gameDetailArr[0].name,
      playtime: gameDetailArr[0].playtime,
    });

    await interaction.reply(
      "game: " + gameDetailArr[0].name + "was added to tracking "
    );
  },
};
