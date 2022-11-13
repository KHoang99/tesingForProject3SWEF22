import { steam_summary } from "./getSteamGamesTest";
const { steamID64, dummySteamID64 } = require("../config.json");

describe("connect to steam ", () => {
  test("slash command argument is an invalid id, expect to fail", async () => {
    const invalidID = 0;
    expect(steam_summary(invalidID)).rejects.toThrowError();
  });

  test("user has no steam games, expect to fail", async () => {
    expect(steam_summary(dummySteamID64)).rejects.toThrowError(
      "No games found"
    );
  });

  test("Main pass", async () => {
    var data = await steam_summary(steamID64);
    expect(data.length).not.toBe(0);
    /**prob move this into select menu test
     * test select menu to handle or not handle a ton of games
     *
     */
  });

  test("invalid Steam ID that is too long", async () => {
    const longString = steamID64 + steamID64;
    // var data = await steam_summary(longString);
    expect(steam_summary(longString)).rejects.toThrowError();
    /**prob move this into select menu test
     * test select menu to handle or not handle a ton of games
     *
     */
  });
});
