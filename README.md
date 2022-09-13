# QCS Discord Bot

This is the discord bot for the Queen’s Computing Society. We use this to verify membership against a Google Sheets spreadsheet

## Before starting

I’d recommend at least a basic understanding of JavaScript and Node.JS, and that you have already completed the DiscordJS getting started guide. [https://discordjs.guide](https://discordjs,guide)

## Installation and Configuration

You’ll need Node.JS installed, version 16.5.0 or higher. I’d recommend using something like `nvm-windows` or `nvm` to manage your installations

Clone the repo

```bash
git clone https://github.com/jamesmcfarland/qcs-discord-bot
```

Install dependencies

```bash
npm install
```

**Important - At this point, you need to configure some options to allow the code to start**

### Discord configuration

Head over to [https://discord.com/developers](https://discord.com/developers), register a new application and create a bot. You’ll also want to add the bot to a server at this point:

- Click “OAuth2”
- Click “URL Generator”
- Enable the `application.commands`, `bot`, `Send Messages` and `Manage Roles` permissions
- Copy the generated link and paste it into your browser, and add the bot to your server

Next, go to “Bot” (Add it if you need to) and click “Reset Token”. Make a note of this, it won’t be shown again!

### Google Cloud Configuration

This section is a touch more involved, and will require you to create a Google Cloud Platform (GCP) Billing Account. 

Don’t worry, the services we are using are completely free! 

Head to [https://console.cloud.google.com](https://console.cloud.google.com) and sign in, go through any setup / walkthrough

Next,

- In the top search bar, search for “APIs & Services” and open the page
- Create a service account:
    - Click “Enable APIs And Services” and enable the “Google Sheets API”
    - Go back to APIs & Services, then click “Credentials”
    - Click “Create Credentials” then “Service Account”. This is what the bot will use to authorise itself with GCP
    - Give it a name, and then click “Done”
    - Click the newly created account, then go to “Keys”, “Add Key” and then “Create New Key”. Copy the downloaded JSON file to the bot’s directory, placing it beside `index.js` and renaming it to `credentials.json`.  **THIS FILE CONTAINS SENSITIVE INFO THAT CAN BE USED TO ACCESS YOUR GCP ACCOUNT. DO NOT UPLOAD IT TO GITHUB OR ANY OTHER SOURCE CONTROL**
- Configure OAuth2 Access
    - Go to APIs & Services, then click “OAuth consent screen”
    - Set the user type as “External” then click “Create”
        - Fill out the form, giving your app a name and providing a contact email. Anything not required can be left blank. Press Save and Continue
        - On the scopes page, click “Add or Remove Scopes”
            - Filter for `spreadsheets`, and select the entry with the description: *See, edit, create and delete all your Google Sheets spreadsheets*
            - Click update, then save and continue
    - All done! That’s GCP configured.

### dotenv Configuration

All settings for this bot are stored in a .env file. This file, like credentials.json, should **not, under any condition, be checked into source control.** 

Create a file called .env beside index.js in the bot directory, then paste in this template and fill out all the values:

```bash
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
ROLE_ID=
SHEET_ID=
SHEET_NAME=
SHEET_VERIFICATION_RANGE=
SHEET_DISCORD_COLUMN=
```

`DISCORD_TOKEN` Your bot's token
`CLIENT_ID` Your discord application Client ID
`GUILD_ID` Your development server’s Guild ID
`ROLE_ID` The ID of the role to give verified users
`SHEET_ID` The ID of the spreadsheet to find member data in 
This can be found in the URL, e.g. [`https://docs.google.com/spreadsheets/d/<SHEET_ID>/`](https://docs.google.com/spreadsheets/d/1qUdS87mXg9OS6ataX9x2PrBNt7gLuKMaTcRp2FLXMHw/)
`SHEET_NAME` The name of the sheet (tab) where the data is
`SHEET_VERIFICATION_RANGE` The range that includes member emails and discord IDs
`SHEET_DISCORD_COLUMN` The column which contains discord IDs

Discord role and Guild IDs can be found by enabling developer mode in Discord Settings, then right clicking both the role and server respectively and clicking “Copy ID”

### Running

Woohoo! That is all the configuration you need! Open up a terminal in the bots directory, start the bot with the below command and cross your fingers:

```bash
node .
```

All being well, this should, after a few seconds, show a message like `[Client] Ready!`

Stop the program with `CTRL-C`

You now need to deploy the commands to discord, this can take some time, so you may want to use `applicationGuildCommands`, instead of `applicationCommands`, inside of `deploy-commands.js`. Regardless, run the following to deploy commands to discord: 

```bash
node deploy-command.js
```

Running using node is great, but it provides no auto-restarting, file watching or anything else. For production, I’d recommend PM2. It allows you to daemonize applications and monitor logs. It can also support load balancing, which depending on your application, could be important

Install PM2 with the below command

```bash
npm install -g pm2
```

Run the app using PM2 with the below command (this enables filesystem watching, starts 4 load-balanced instances and gives it a friendly name

```bash
pm2 start index.js --name QCS -i 4 --watch
```

Enable PM2 at startup

```bash
pm2 startup
```

And finally, save the current state of processes, as this will be used to start services when the server reboots

```bash
pm2 save
```

That’s it! The bot should now be working! 

## Disclaimer

This code will only be updated as needed for feature, security and performance reasons, and should not be considered to be actively maintained.

QCS, or the Queen’s Computing Society, is a Society of Queen’s University Belfast (QUB) 

This code is provided as-is, with no warranty and the Queen’s Computing Society, QUB or any associated party accepts no responsibility or liability for any and all damages, costs or other consequences that arise from using this application, its code or any other associated assets.
