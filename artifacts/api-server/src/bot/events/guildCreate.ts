import { Guild, TextChannel, PermissionFlagsBits } from "discord.js";
import { ensureGuild } from "../database.js";
import { captureSnapshot } from "../systems/recovery.js";
import { buildHelpEmbed } from "../embed.js";
import { logger } from "../../lib/logger.js";

export async function onGuildCreate(guild: Guild): Promise<void> {
  logger.info({ guildId: guild.id, name: guild.name }, "Joined new guild");
  await ensureGuild(guild.id);
  await captureSnapshot(guild);

  // Find best channel to send welcome embed
  try {
    const me = guild.members.me;
    const channel =
      (guild.systemChannel?.permissionsFor(me!)?.has(PermissionFlagsBits.SendMessages)
        ? guild.systemChannel
        : null) ??
      (guild.channels.cache
        .filter(c =>
          c instanceof TextChannel &&
          c.permissionsFor(me!)?.has(PermissionFlagsBits.SendMessages),
        )
        .first() as TextChannel | undefined) ??
      null;

    if (!channel || !(channel instanceof TextChannel)) return;

    const { embed, row } = buildHelpEmbed(guild.client);

    const welcomeIntro = [
      `> 👋  **Thanks for adding Shonargaon Antinuke to ${guild.name}!**`,
      `> Run \`/antinuke enable\` and \`/logging setup #channel\` to get started.`,
      `> Type \`/help\` or mention me anytime to see this panel.`,
    ].join("\n");

    await channel.send({ content: welcomeIntro, embeds: [embed], components: [row] });
  } catch (err) {
    logger.warn({ err, guildId: guild.id }, "Failed to send welcome embed");
  }
}
