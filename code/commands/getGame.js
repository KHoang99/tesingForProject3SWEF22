//search for a specific game with auto-complete
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const SteamAPI = require("steamapi");

//this mocks an id grabbed from the database
const { steamID64, dummySteamID64 } = require("../config.json");
/*
  Functions for error handling
  */ function handleError(e, chat) {
  if (e.response) {
    console.log(`Server Error: ${e}`);
  } else if (e.request) {
    console.log(`Nework Error: ${e}`);
  } else {
    console.log(`Client Error: ${e}`);
  }
}
async function steam_summary() {
  try {
    const steam = new SteamAPI(process.env.STEAM_TOKEN);
    var gamesData = await steam.getUserOwnedGames(steamID64);
    return gamesData;
  } catch (err) {
    await handleError(err);
  }
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("game")
    .setDescription("get Game")
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("Game Detail Based on Autocomplete")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction, client) {
    //move this up

    var gameList = await steam_summary(interaction);
    let choices;
    try {
      choices = gameList.slice(0, 22).map((a) => a.name);
    } catch (err) {
      handleError(err);
      return;
    }

    const focusedValue = interaction.options.getFocused();
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction) {
    //#region gameTitle
    const game = interaction.options.getString("game");
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

    //button pressed to track a game from the autocomplete search
    //currently there is no functionality to handle this interaction yet
    //alternatively use the track command instead
    // const row = new ActionRowBuilder().addComponents(
    //   new ButtonBuilder()
    //     .setCustomId("primary")
    //     .setLabel("Track Game Playtime")
    //     .setStyle(ButtonStyle.Primary)
    // );

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(gameDetailArr[0].name)
      // .setURL("Link to game on steam")
      .setDescription("Discord User's Steam Game's Playtime")
      .setThumbnail(gameDetailArr[0].iconURL)
      .addFields({
        name: "in-game hours: ",
        value: gameDetailArr[0].playtime / 60 + " hrs",
      });
    //#endregion

    //test other steamapi methods
    // async function getGameDetail() {
    //   const steam = new SteamAPI(process.env.STEAM_TOKEN);
    //   return (data = await steam.getGameDetails("400"));
    // }

    await interaction.reply({
      content: "Please work,",
      embeds: [embed],
      // components: [row],
    });
  },
};
