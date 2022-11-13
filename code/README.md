
## node modules already installedn these steps are not required, <br> 

~~requires~~

~~npm init <br>~~
~~npm i discord.js <br>~~
~~npm i steamapi <br>~~ 
~~npm i dotenv <br>~~

~~dotenv file contains tokens and api keys <br>~~
~~config.json contains Id's <br>~~

~~for testing <br>~~
~~npm i -D jest <br>~~ 
~~<br>~~
# Building
add an env with DISCOD_TOKEN, the bot's discord token  <br>
and STEAM_TOKEN, your steam api key  <br>
to test your own steam id with the steam api  <br>
in config.json  replace the pressupplied with your steamid64  <br>  
to test discord bot run  >node .


to build a command run >node deploy-commands.js


## Project Installation 

```
npm install
```

create a env file in this folder with the following

```env
DISCORD_TOKEN=<Your token here>
STEAM_TOKEN = <Your Steam API KEY here>
```

## Application setup
1. Go through each step in https://discordjs.guide/preparations/setting-up-a-bot-application.html
2. Go through each step in https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links


### naht this

1. create/login to discord and go to https://discord.com/developers/applications
2. in the **Applications** tab , click on "new application" button
3. Enter a name and confirm the pop-up window by clicking the "Create" button.
4. now go into that application's page and go under the Bot section. Click the "Add Bot" button on the right and confirm the pop-up window by clicking "Yes, do it!". Congratulations, you're now the proud owner of a shiny new Discord bot! You're not entirely done, though
5. now in the application's page go under the OAuth2 -> URL Generator section 
select the following scopes
![](https://media.discordapp.net/attachments/1036673675103064064/1041356402435817542/image.png?width=1314&height=428)
and for the convient sake of testing choose the bot permission ```adminstrator``` 
![](https://media.discordapp.net/attachments/1036673675103064064/1041356450313818132/image.png?width=1314&height=631)
alternatively the bot permission that would also work here is ```send messages``` and ```use slash commands```
6. now get into the Generated URL, choose the server for the bot to be added to and click Authorize 

## Connecting the bot to the project
1. in the application's page under the bot section get the token by clicking "Reset Roken" ** this can only be view once **
![](https://cdn.discordapp.com/attachments/1036673675103064064/1041352733761994862/image.png)

copy and paste as a value for DISCORD_TOKEN in the dotenv file

2. obtain a steam api key by signing into your steam account and go to https://steamcommunity.com/dev/apikey
copy and paste as a value for STEAM_TOKEN in the dotenv file

now to test discord bot run  
```
node .
```

to build the commands run 
```
node deploy-commands.js
```

you can give further continuous deployment of your discord application by hosting it on a server such as digitalocean or google cloud's free tier
