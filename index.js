import "dotenv/config";
import { Client, Collection, Intents } from "discord.js";
import * as fs from "fs";
import { log } from "./utils/console.js";

console.log(
  "\nQCSBot - Queen's Computing Society's Discord Bot\nJames McFarland - Queen's Computing Society 2022\n\nStarting...\n\n"
);

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  // const command = require(`./commands/${file}}`);
  import(`./commands/${file}`).then(({ command }) => {
    client.commands.set(command.data.name, command);
  });
}

client.once("ready", () => {
  log("[Client] Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;
  log("[Client] Command Recieved");

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
