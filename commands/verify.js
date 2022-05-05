import { SlashCommandBuilder } from "@discordjs/builders";
import { verify } from "../sheets/verify.js";
import { log } from "../utils/console.js";
import "dotenv/config";

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
    const role = await interaction.guild.roles.fetch(process.env.ROLE_ID);
    const user = interaction.member;

    await interaction.deferReply({ ephemeral: true });

    await interaction.editReply({
      content: `Verifying using \`${email}\`. Two seconds...`,
      ephemeral: true,
    });
    log("[Command Engine] Initial Reply Sent");

    const verified = await verify(email, discordUserId);

    try {
      if (verified) {
        user.roles.add(role);
        // member.roles.add(role);
      }
    } catch (e) {
      await interaction.followUp({
        content:
          "I couldn't give you the role, you're above my pay grade! Let the admins know",
        ephemeral: true,
      });
    }

    await interaction.followUp({
      content: verified ? "Verified ✅" : "Failed to verify ❌",
      ephemeral: true,
    });
    log("[Command Engine] Follow Up Reply Sent");
    log("[Command Engine] Execution Done");
  },
};
