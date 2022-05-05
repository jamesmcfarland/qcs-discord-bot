import { SlashCommandBuilder } from "@discordjs/builders";

export const command = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Replies with server info!"),
  async execute(interaction) {
    console.log("ROLES: "+interaction.guild.roles);
    await interaction.reply(
      `server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  },
};

