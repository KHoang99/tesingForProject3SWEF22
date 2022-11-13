//gets a list of all the steam games the user plays with their playtime
require("dotenv").config();
const { steamID64, dummySteamID64 } = require("../config.json");
const {
  ComponentType,
  SlashCommandBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const SteamAPI = require("steamapi");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ig_hours")
    .setDescription("gets the playtime of owned steam games")
    .addStringOption((option) =>
      option
        .setName("steamid")
        .setDescription("the steamid64 of the user")
        .setRequired(true)
    ),
  async execute(interaction) {
    const steamID = interaction.options.getString("steamid");
    /*
  Functions for error handling
  */ async function handleError(e) {
      if (e.response) {
        await interaction.reply(`Server Error: ${e}`);
      } else if (e.request) {
        await interaction.reply(`Nework Error: ${e}`);
      } else {
        await interaction.reply(`Client Error: ${e}`);
      }
    }
    async function steam_summary() {
      try {
        const steam = new SteamAPI(process.env.STEAM_TOKEN);
        var gamesData = await steam.getUserOwnedGames(steamID);
        return gamesData;
      } catch (err) {
        await handleError(err);
      }
    }

    //show user summary, no async with .then
    // steam.getUserSummary("steamID64").then((summary) => {
    //   console.log(summary);
    // });

    //retrieves items outside of promise method

    var gamesList = await steam_summary();
    var sampleList = [];
    try {
      sampleList = gamesList.slice(0, 22);
    } catch (err) {
      return;
    }
    //sample

    const embed = new EmbedBuilder().setDescription(
      "Please choose a category in the dropdown menu"
    );

    let options = [];
    for (let i = 0; i < sampleList.length; i++) {
      //literally label and value being the same thing doesnt sound right but it will code right
      options.push({
        label: `${sampleList[i].name}`,
        value: `${sampleList[i].name}`,
      });
    }
    //function with state to set it disable/enable
    const menu = (state) => [
      new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("select")
          .setPlaceholder("Nothing selected")
          .setOptions(options)
      ),
    ];

    const initialMessage = await interaction.reply({
      embeds: [embed],
      components: menu(false),
    });

    const filter = (interaction) =>
      interaction.user.id === interaction.member.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      //this method is depreceated but still works codewise.. so for now i just keeping it
      componentType: ComponentType.SelectMenu,
    });
    collector.on("collect", (interaction) => {
      const title = interaction.values;
      const game = sampleList.find(({ name }) => name === title[0]);
      let fields = [];
      fields.push({
        name: "Game name: " + `${game.name}`,
        value: "Game Playtime: " + `${game.playTime}` + " hrs",
        inline: true,
      });
      const ingamehoursEmbed = new EmbedBuilder()
        .setTitle("Owned Steam Game")
        .addFields(fields);

      interaction.update({ embeds: [ingamehoursEmbed] });
    });

    //now make it able with components
    collector.on("end", () => {
      initialMessage.edit({ components: menu(true) });
    });
  },
};
