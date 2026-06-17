import { Message, GuildMember, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { handleMessageXP } from "../systems/leveling.js";
import { handleCustomCommand } from "../systems/customcmds.js";
import { getGuildSettings } from "../database.js";
import { isBotOwner } from "../database.js";
import { buildHelpEmbed, BRAND, successEmbed, errorEmbed } from "../embed.js";
import { UNIVERSAL_OWNER_ID } from "../config.js";
import { logger } from "../../lib/logger.js";

// ── Helpers ─────────────────────────────────────────────────────────────────
function parseMention(str: string): string | null {
  const match = /<@!?(\d+)>/.exec(str);
  if (match) return match[1]!;
  if (/^\d{15,20}$/.test(str)) return str;
  return null;
}

// ── Prefix handlers ──────────────────────────────────────────────────────────
async function handlePrefixBan(message: Message, args: string[]): Promise<void> {
  if (!message.guild || !message.member) return;
  const member = message.member as GuildMember;
  const hasPerms = member.permissions.has(PermissionFlagsBits.BanMembers) || message.author.id === UNIVERSAL_OWNER_ID;
  if (!hasPerms) { await message.reply({ embeds: [errorEmbed("You need **Ban Members** permission.")] }); return; }

  const userId = args[0] ? parseMention(args[0]) : null;
  if (!userId) { await message.reply({ embeds: [errorEmbed("Usage: `$ban @user [reason]`")] }); return; }

  const reason = args.slice(1).join(" ") || "No reason provided";
  try {
    const user = await message.client.users.fetch(userId).catch(() => null);
    await message.guild.members.ban(userId, { reason });
    await message.reply({
      embeds: [new EmbedBuilder()
        .setColor(0xed4245)
        .setTitle("🔨  Member Banned")
        .addFields(
          { name: "User",   value: user ? `${user.tag}  (\`${userId}\`)` : `\`${userId}\``, inline: true },
          { name: "By",     value: message.author.tag, inline: true },
          { name: "Reason", value: reason },
        )
        .setFooter({ text: BRAND.name, iconURL: BRAND.icon ?? undefined })
        .setTimestamp()],
    });
  } catch { await message.reply({ embeds: [errorEmbed("Failed to ban — check my role is above theirs.")] }); }
}

async function handlePrefixKick(message: Message, args: string[]): Promise<void> {
  if (!message.guild || !message.member) return;
  const member = message.member as GuildMember;
  const hasPerms = member.permissions.has(PermissionFlagsBits.KickMembers) || message.author.id === UNIVERSAL_OWNER_ID;
  if (!hasPerms) { await message.reply({ embeds: [errorEmbed("You need **Kick Members** permission.")] }); return; }

  const userId = args[0] ? parseMention(args[0]) : null;
  if (!userId) { await message.reply({ embeds: [errorEmbed("Usage: `$kick @user [reason]`")] }); return; }

  const reason = args.slice(1).join(" ") || "No reason provided";
  try {
    const target = await message.guild.members.fetch(userId).catch(() => null);
    if (!target) { await message.reply({ embeds: [errorEmbed("That user is not in this server.")] }); return; }
    await target.kick(reason);
    await message.reply({
      embeds: [new EmbedBuilder()
        .setColor(0xfee75c)
        .setTitle("👢  Member Kicked")
        .addFields(
          { name: "User",   value: `${target.user.tag}  (\`${userId}\`)`, inline: true },
          { name: "By",     value: message.author.tag, inline: true },
          { name: "Reason", value: reason },
        )
        .setFooter({ text: BRAND.name, iconURL: BRAND.icon ?? undefined })
        .setTimestamp()],
    });
  } catch { await message.reply({ embeds: [errorEmbed("Failed to kick — check my role is above theirs.")] }); }
}

async function handlePrefixDm(message: Message, args: string[]): Promise<void> {
  if (!await isBotOwner(message.author.id)) {
    await message.reply({ embeds: [errorEmbed("Only **bot owners** can use this command.")] });
    return;
  }
  const userId = args[0] ? parseMention(args[0]) : null;
  if (!userId) { await message.reply({ embeds: [errorEmbed("Usage: `$dm @user <message>`")] }); return; }
  const content = args.slice(1).join(" ");
  if (!content) { await message.reply({ embeds: [errorEmbed("Please provide a message.\nUsage: `$dm @user <message>`")] }); return; }

  try {
    const user = await message.client.users.fetch(userId);
    await user.send(content);
    await message.reply({ embeds: [successEmbed(`DM sent to **${user.tag}**`)] });
  } catch { await message.reply({ embeds: [errorEmbed("Could not send DM — the user may have DMs disabled.")] }); }
}

// ── Main handler ─────────────────────────────────────────────────────────────
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

    // XP system (runs regardless of prefix)
    await handleMessageXP(message);

    // Prefix command dispatch
    const settings = await getGuildSettings(message.guild.id);
    const prefix = settings.prefix || "$";

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const cmdName = args.shift()?.toLowerCase() ?? "";
    if (!cmdName) return;

    switch (cmdName) {
      case "ban":
        await handlePrefixBan(message, args);
        break;
      case "kick":
        await handlePrefixKick(message, args);
        break;
      case "dm":
        await handlePrefixDm(message, args);
        break;
      case "help": {
        const { embed, row } = buildHelpEmbed(message.client);
        await message.reply({ embeds: [embed], components: [row] });
        break;
      }
      case "ping":
        await message.reply({ embeds: [new EmbedBuilder()
          .setColor(0x000000)
          .setTitle("🏓  Pong!")
          .addFields({ name: "📡  API Latency", value: `\`${Math.round(message.client.ws.ping)}ms\``, inline: true })
          .setFooter({ text: BRAND.name, iconURL: BRAND.icon ?? undefined })
          .setTimestamp()] });
        break;
      default:
        // Fall through to custom tag lookup
        await handleCustomCommand(message, cmdName);
        break;
    }
  } catch (err) {
    logger.error({ err, guildId: message.guild?.id }, "messageCreate error");
  }
}
