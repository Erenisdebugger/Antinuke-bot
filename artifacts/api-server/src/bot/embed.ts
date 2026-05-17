import { EmbedBuilder, Client, ColorResolvable } from "discord.js";
import { COLORS } from "./config.js";

export const BRAND = {
  name: "Guardian",
  color: 0x5865f2 as number,
  icon: null as string | null,
};

export function setBotIcon(client: Client) {
  BRAND.icon = client.user?.displayAvatarURL({ size: 64 }) ?? null;
}

function base(color: number): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(color as ColorResolvable)
    .setFooter({ text: `${BRAND.name} • Powered by Guardian`, iconURL: BRAND.icon ?? undefined })
    .setTimestamp();
}

export function successEmbed(description: string, title?: string): EmbedBuilder {
  const e = base(COLORS.success).setDescription(`<:check:✅> ${description}`);
  if (title) e.setTitle(title);
  return e;
}

export function errorEmbed(description: string, title?: string): EmbedBuilder {
  const e = base(COLORS.red).setDescription(`❌ ${description}`);
  if (title) e.setTitle(title);
  return e;
}

export function infoEmbed(title: string, description?: string): EmbedBuilder {
  const e = base(BRAND.color).setTitle(title);
  if (description) e.setDescription(description);
  return e;
}

export function warningEmbed(description: string, title?: string): EmbedBuilder {
  const e = base(COLORS.warning).setDescription(`⚠️ ${description}`);
  if (title) e.setTitle(title);
  return e;
}

export function antinukeEmbed(action: string, offenderId: string, punishment: string, reason: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xff0000 as ColorResolvable)
    .setTitle("⚡ ANTINUKE TRIGGERED")
    .setDescription(`An unauthorized action was detected and blocked.`)
    .addFields(
      { name: "🎯 Action", value: `\`${action}\``, inline: true },
      { name: "👤 Offender", value: `<@${offenderId}> (\`${offenderId}\`)`, inline: true },
      { name: "⚖️ Punishment", value: `\`${punishment}\``, inline: true },
      { name: "📋 Reason", value: reason },
    )
    .setFooter({ text: `${BRAND.name} Antinuke`, iconURL: BRAND.icon ?? undefined })
    .setTimestamp();
}

export function lockdownEmbed(active: boolean): EmbedBuilder {
  return new EmbedBuilder()
    .setColor((active ? 0xff0000 : 0x57f287) as ColorResolvable)
    .setTitle(active ? "🔒 ANTI-RAID LOCKDOWN ACTIVE" : "🔓 LOCKDOWN LIFTED")
    .setDescription(active
      ? "Mass join detected! All channels have been locked.\nUse `/antiraid unlock` to restore access."
      : "The server is now back to normal.")
    .setFooter({ text: `${BRAND.name} Anti-Raid`, iconURL: BRAND.icon ?? undefined })
    .setTimestamp();
}

export function levelUpEmbed(userId: string, level: number, avatarUrl?: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x9b59b6 as ColorResolvable)
    .setTitle("⬆️ Level Up!")
    .setDescription(`🎉 <@${userId}> just reached **Level ${level}**!`)
    .setThumbnail(avatarUrl ?? null)
    .setFooter({ text: `${BRAND.name} Leveling`, iconURL: BRAND.icon ?? undefined })
    .setTimestamp();
}

export function giveawayEmbed(prize: string, winnersCount: number, hostId: string, endsAt: Date, entries: number, requirements?: string | null): EmbedBuilder {
  const e = new EmbedBuilder()
    .setColor(0xf1c40f as ColorResolvable)
    .setTitle(`🎉 GIVEAWAY`)
    .addFields(
      { name: "🏆 Prize", value: `**${prize}**`, inline: false },
      { name: "🎟️ Entries", value: `**${entries}**`, inline: true },
      { name: "👑 Winners", value: `**${winnersCount}**`, inline: true },
      { name: "🕐 Ends", value: `<t:${Math.floor(endsAt.getTime() / 1000)}:R>`, inline: true },
      { name: "🎙️ Hosted by", value: `<@${hostId}>`, inline: true },
    )
    .setFooter({ text: `${BRAND.name} Giveaways • Click 🎉 to enter`, iconURL: BRAND.icon ?? undefined })
    .setTimestamp(endsAt);
  if (requirements) e.addFields({ name: "📋 Requirements", value: requirements });
  return e;
}

export function giveawayEndedEmbed(prize: string, winners: string[], hostId: string, totalEntries: number): EmbedBuilder {
  return new EmbedBuilder()
    .setColor((winners.length > 0 ? 0x57f287 : 0xed4245) as ColorResolvable)
    .setTitle("🎉 GIVEAWAY ENDED")
    .addFields(
      { name: "🏆 Prize", value: `**${prize}**`, inline: false },
      { name: "🥇 Winners", value: winners.length > 0 ? winners.map(w => `<@${w}>`).join(", ") : "No winners — no entries!", inline: false },
      { name: "🎙️ Hosted by", value: `<@${hostId}>`, inline: true },
      { name: "🎟️ Total Entries", value: `**${totalEntries}**`, inline: true },
    )
    .setFooter({ text: `${BRAND.name} Giveaways`, iconURL: BRAND.icon ?? undefined })
    .setTimestamp();
}

export function ticketEmbed(ticketNum: number, userId: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x5865f2 as ColorResolvable)
    .setTitle(`🎫 Ticket #${ticketNum}`)
    .setDescription(`Hello <@${userId}>! Our support team will be with you shortly.\n\nPlease describe your issue in detail below.`)
    .addFields({ name: "📋 Opened by", value: `<@${userId}>`, inline: true })
    .setFooter({ text: `${BRAND.name} Tickets`, iconURL: BRAND.icon ?? undefined })
    .setTimestamp();
}

export function verifyEmbed(serverName: string, code: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x5865f2 as ColorResolvable)
    .setTitle("🔐 Human Verification")
    .setDescription(
      `Welcome to **${serverName}**!\n\n` +
      `To gain access, click the button below and **type** (not copy) the code:\n\n` +
      `\`\`\`${code}\`\`\`\n` +
      `> ⏱️ Expires in **5 minutes**\n` +
      `> ⚠️ You have **3 attempts**\n` +
      `> 🚫 Do **NOT** copy-paste — type manually`
    )
    .setFooter({ text: `${BRAND.name} Verification`, iconURL: BRAND.icon ?? undefined })
    .setTimestamp();
}

export function rankEmbed(username: string, avatarUrl: string, level: number, xp: number, totalXp: number, nextLevelXp: number): EmbedBuilder {
  const progress = Math.min(20, Math.floor((xp / nextLevelXp) * 20));
  const bar = "█".repeat(progress) + "░".repeat(20 - progress);
  const pct = Math.floor((xp / nextLevelXp) * 100);

  return new EmbedBuilder()
    .setColor(0x9b59b6 as ColorResolvable)
    .setAuthor({ name: `${username}'s Rank Card`, iconURL: avatarUrl })
    .setThumbnail(avatarUrl)
    .addFields(
      { name: "🎖️ Level", value: `**${level}**`, inline: true },
      { name: "⭐ XP", value: `**${xp.toLocaleString()}** / **${nextLevelXp.toLocaleString()}**`, inline: true },
      { name: "📊 Total XP", value: `**${totalXp.toLocaleString()}**`, inline: true },
      { name: `Progress — ${pct}%`, value: `\`[${bar}]\`` },
    )
    .setFooter({ text: `${BRAND.name} Leveling`, iconURL: BRAND.icon ?? undefined })
    .setTimestamp();
}

export function balanceEmbed(username: string, avatarUrl: string, wallet: number, bank: number, currency: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xf1c40f as ColorResolvable)
    .setAuthor({ name: `${username}'s Wallet`, iconURL: avatarUrl })
    .setThumbnail(avatarUrl)
    .addFields(
      { name: `${currency} Wallet`, value: `**${wallet.toLocaleString()}**`, inline: true },
      { name: `🏦 Bank`, value: `**${bank.toLocaleString()}**`, inline: true },
      { name: `💎 Net Worth`, value: `**${(wallet + bank).toLocaleString()}**`, inline: true },
    )
    .setFooter({ text: `${BRAND.name} Economy`, iconURL: BRAND.icon ?? undefined })
    .setTimestamp();
}

export function antinukeStatusEmbed(
  enabled: boolean,
  punishment: string,
  interval: number,
  maxBans: number,
  maxKicks: number,
  maxChDel: number,
  maxRoleDel: number,
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor((enabled ? 0x57f287 : 0xed4245) as ColorResolvable)
    .setTitle("⚡ Antinuke System")
    .addFields(
      { name: "Status", value: enabled ? "🟢 **Enabled**" : "🔴 **Disabled**", inline: true },
      { name: "⚖️ Punishment", value: `\`${punishment}\``, inline: true },
      { name: "⏱️ Interval", value: `\`${interval}s\``, inline: true },
      { name: "🔨 Max Bans", value: `\`${maxBans}\``, inline: true },
      { name: "👢 Max Kicks", value: `\`${maxKicks}\``, inline: true },
      { name: "📁 Max Ch. Deletes", value: `\`${maxChDel}\``, inline: true },
      { name: "🏷️ Max Role Deletes", value: `\`${maxRoleDel}\``, inline: true },
    )
    .setFooter({ text: `${BRAND.name} Protection`, iconURL: BRAND.icon ?? undefined })
    .setTimestamp();
}
