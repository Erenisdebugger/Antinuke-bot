import { Message } from "discord.js";
import { handleMessageXP } from "../systems/leveling.js";
import { handleCustomCommand } from "../systems/customcmds.js";
import { getGuildSettings } from "../database.js";
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

    // Custom commands / tags (prefix-based — uses guild-specific prefix from DB)
    const settings = await getGuildSettings(message.guild.id);
    const prefix = settings.prefix || "$";

    if (message.content.startsWith(prefix)) {
      const trigger = message.content.slice(prefix.length).split(" ")[0]?.toLowerCase();
      if (trigger) {
        await handleCustomCommand(message, trigger);
      }
    }
  } catch (err) {
    logger.error({ err, guildId: message.guild?.id }, "messageCreate error");
  }
}
