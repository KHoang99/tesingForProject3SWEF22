//const id = require('./config.json');
//const api = require('./src/SteamAPI.js');

// User and SteamID can be used for testing
const username = 'DezzyNutzzz'
const steamID = '76561198352231643'
const steamKey = 'YOUR_STEAM_KEY' // Enter your own/get one
const appID = '1172470' // Apex Legends

api.getUserAchievements('76561198352231643', '1172470', '9152EEA5A59B044E1E4058AB64E5F6B9') {
//  if (!reID.test(id)) return Promise.reject(new TypeError('Invalid/no id provided'));
//  if (!reApp.test(app)) return Promise.reject(new TypeError('Invalid/no appid provided'));

  return this
    .get(`/ISteamUserStats/GetPlayerAchievements/v1?appid=${app}&key=${key}&steamid=${id}&l=english`)
    .then(json => {
        console.log(json.data)
    }).catch(console.error)
}
