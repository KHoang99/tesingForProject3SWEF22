//const SteamID = require('../config.js');

const reApp = /^\d{1,7}$/;
const reID = /^\d{17}$/;

class SteamAPI {
   /**
   * Get users achievements for app id.
   * @param {string} id User ID
   * @param {string} app App ID
   * @returns {Promise<PlayerAchievements>} Achievements
   */
   getUserAchievements(id, app, key) {
    if (!reID.test(id)) return Promise.reject(new TypeError('Invalid/no id provided'));
    if (!reApp.test(app)) return Promise.reject(new TypeError('Invalid/no appid provided'));

    return this
      .get(`/ISteamUserStats/GetPlayerAchievements/v1?steamid=${id}&key=${key}&appid=${app}&l=english`)
      .then(json => {
          console.log(result.data)
      }).catch(console.error)
    }
}
