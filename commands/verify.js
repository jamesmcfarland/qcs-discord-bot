import { SlashCommandBuilder } from "@discordjs/builders";
import { verify } from "../sheets/verify.js";
import { log } from "../utils/console.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verify")
    .addStringOption((option) =>
      option
        .setName("email")
        .setDescription("The email to use for verifying")
        .setRequired(true)
    ),
  async execute(interaction) {
    log("[Command Engine] Execution Started for Verify");

    const email = interaction.options.getString("email");
    const discordUserId = interaction.user.id;
    const role = interaction.guild.roles.find(
      (role) => role.name === "QCS Verified ✅"
    );
    const user = interaction.user;

    await interaction.deferReply({ ephemeral: true });

    await interaction.editReply({
      content: `Verifying using \`${email}\`. Two seconds...`,
      ephemeral: true,
    });
    log("[Command Engine] Initial Reply Sent");

    const verified = await verify(email, discordUserId);

    if (verified) {
      user.roles.add(role);
      // member.roles.add(role);
    }

    await interaction.followUp({
      content: verified ? "Verified ✅" : "Failed to verify ❌",
      ephemeral: true,
    });
    log("[Command Engine] Follow Up Reply Sent");
    log("[Command Engine] Execution Done");
  },
};
