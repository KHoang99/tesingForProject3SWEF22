//a dependency-less function to serve the purpose of unit testing connecting to the steam and grabbing a list og games
require("dotenv").config();
const SteamAPI = require("steamapi/src/SteamAPI");
const { steamID64 } = require("../config.json");
module.exports = {
  async steam_summary(id) {
    const steam = new SteamAPI(process.env.STEAM_TOKEN);
    var gamesData = await steam.getUserOwnedGames(id);
    return gamesData;
  },
};
