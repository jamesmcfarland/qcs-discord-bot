import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import "dotenv/config";
import * as fs from "fs";
import { log } from "./utils/console.js";

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const {command} = await import(`./commands/${file}`);
    log(`registering ${command.data.name}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);
log(process.env.GUILD_ID);
log(process.env.CLIENT_ID);
log(commands);
rest
  .put(
    Routes.applicationCommands(
      process.env.CLIENT_ID,
      // process.env.GUILD_ID
    ),
    { body: commands }
  )
  .then((res) =>
    log("Successfully registered application commands.")
  )
  .catch(console.error);
