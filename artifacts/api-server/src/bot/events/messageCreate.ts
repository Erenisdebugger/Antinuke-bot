import { Message } from "discord.js";
import { handleMessageXP } from "../systems/leveling.js";
import { handleCustomCommand } from "../systems/customcmds.js";
import { BOT_PREFIX } from "../config.js";
import { buildHelpEmbed } from "../embed.js";
import { logger } from "../../lib/logger.js";

export async function onMessageCreate(message: Message): Promise<void> {
  if (message.author.bot || !message.guild) return;

  try {
    // Bot mention → show help embed
    const mentionRegex = new RegExp(`^<@!?${message.client.user.id}>`);
    if (mentionRegex.test(message.content.trim())) {
      const { embed, row } = buildHelpEmbed(message.client);
      await message.reply({ embeds: [embed], components: [row] });
      return;
    }

    // XP system
    await handleMessageXP(message);

    // Custom commands / tags (prefix-based)
    if (message.content.startsWith(BOT_PREFIX)) {
      const trigger = message.content.slice(BOT_PREFIX.length).split(" ")[0]?.toLowerCase();
      if (trigger) {
        await handleCustomCommand(message, trigger);
      }
    }
  } catch (err) {
    logger.error({ err, guildId: message.guild?.id }, "messageCreate error");
  }
}
