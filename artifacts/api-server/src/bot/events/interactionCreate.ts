import { Interaction, ChatInputCommandInteraction, ButtonInteraction, ModalSubmitInteraction } from "discord.js";
import { handleCommand, buildAntinukePanel } from "../commands/index.js";
import { handleGiveawayEntry } from "../systems/giveaway.js";
import { handleTicketCreate, handleTicketClose, handleTicketClaim } from "../systems/tickets.js";
import { handleVerifyButton, handleVerifyModal } from "../systems/verification.js";
import { updateAntiNukeConfig, getAntiNukeConfig } from "../database.js";
import { isTrustedUser } from "../systems/antinuke.js";
import { logger } from "../../lib/logger.js";

export async function onInteractionCreate(interaction: Interaction): Promise<void> {
  try {
    if (interaction.isChatInputCommand()) {
      await handleCommand(interaction as ChatInputCommandInteraction);
      return;
    }

    if (interaction.isButton()) {
      const btn = interaction as ButtonInteraction;
      const id = btn.customId;

      if (id.startsWith("giveaway:enter:")) {
        await handleGiveawayEntry(btn);
      } else if (id === "ticket:create") {
        await handleTicketCreate(btn);
      } else if (id === "ticket:close") {
        await handleTicketClose(btn);
      } else if (id === "ticket:claim") {
        await handleTicketClaim(btn);
      } else if (id.startsWith("verify:")) {
        await handleVerifyButton(btn);
      } else if (id === "dev:keren_os") {
        await btn.reply({
          embeds: [new (await import("discord.js")).EmbedBuilder()
            .setColor(0x9B59B6 as any)
            .setTitle("🌊  Keren OS — Intelligence System")
            .setDescription("```\nroot@keren-os:~# cat /etc/keren.conf\n\n  SYSTEM     : Keren OS v1.0\n  TYPE       : Autonomous AI\n  ARCHITECT  : KAZI EREN\n  PURPOSE    : Bot management & server protection\n  STATUS     : ● ONLINE — All modules nominal\n\nroot@keren-os:~# █\n```")
            .setFooter({ text: "Keren OS  ·  Autonomous Intelligence Layer" })
            .setTimestamp()],
          ephemeral: true,
        });
      } else if (id === "dev:support") {
        await btn.reply({
          embeds: [new (await import("discord.js")).EmbedBuilder()
            .setColor(0x9B59B6 as any)
            .setTitle("⭐  Shonargaon Antinuke — Support")
            .setDescription("```\nroot@keren-os:~# ./support --query\n\n  BOT NAME   : Shonargaon Antinuke\n  DEV        : KAZI EREN\n  CONTACT    : Reach out via DM\n  STATUS     : ● Available for support\n\nroot@keren-os:~# █\n```")
            .setFooter({ text: "Keren OS  ·  Support Terminal" })
            .setTimestamp()],
          ephemeral: true,
        });
      } else if (id.startsWith("antinuke:toggle:")) {
        // antinuke:toggle:{module}:{guildId}
        const parts = id.split(":");
        const module = parts[2];
        const guildId = parts[3];
        if (!btn.guild || btn.guild.id !== guildId || !module) {
          await btn.reply({ content: "❌ Invalid interaction.", ephemeral: true }); return;
        }
        if (!await isTrustedUser(btn.guild, btn.user.id)) {
          await btn.reply({ content: "❌ Only trusted users can toggle modules.", ephemeral: true }); return;
        }
        const cfg = await getAntiNukeConfig(guildId);
        const current = (cfg as Record<string, unknown>)[module] as boolean ?? true;
        await updateAntiNukeConfig(guildId, { [module]: !current } as any);
        const newCfg = await getAntiNukeConfig(guildId);
        const { embed, components } = buildAntinukePanel(btn.guild.name, newCfg, guildId);
        await btn.update({ embeds: [embed], components });
      }
      return;
    }

    if (interaction.isModalSubmit()) {
      const modal = interaction as ModalSubmitInteraction;
      if (modal.customId.startsWith("verify_modal:")) {
        await handleVerifyModal(modal);
      }
      return;
    }
  } catch (err) {
    logger.error({ err, type: interaction.type }, "interactionCreate error");
  }
}
