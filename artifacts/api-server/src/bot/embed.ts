import { EmbedBuilder, Client, ColorResolvable } from "discord.js";

export const BRAND = {
  name: "Shonargaon Antinuke",
  short: "SAN",
  color: 0x5865f2 as number,
  icon: null as string | null,
};

export function setBotIcon(client: Client) {
  BRAND.icon = client.user?.displayAvatarURL({ size: 64 }) ?? null;
}

function footer(tag?: string): { text: string; iconURL?: string } {
  return {
    text: `${BRAND.name}${tag ? ` • ${tag}` : ""}`,
    iconURL: BRAND.icon ?? undefined,
  };
}

function base(color: number): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(color as ColorResolvable)
    .setFooter(footer())
    .setTimestamp();
}

// ─── Toggle / Module Status ────────────────────────────────────────────────
export function toggleEmbed(
  module: string,
  enabled: boolean,
  extras?: { name: string; value: string; inline?: boolean }[],
): EmbedBuilder {
  const color: ColorResolvable = enabled ? 0x57f287 : 0xed4245;
  const dot = enabled ? "🟢" : "🔴";
  const label = enabled ? "Enabled" : "Disabled";

  const e = new EmbedBuilder()
    .setColor(color)
    .setTitle(`${module}`)
    .setDescription(
      `${dot}  **Status —** ${label}\n` +
      `\u200b`,
    )
    .setFooter(footer(module))
    .setTimestamp();

  if (extras?.length) e.addFields(extras);
  return e;
}

// ─── Confirmation / Success ────────────────────────────────────────────────
export function successEmbed(description: string, title?: string): EmbedBuilder {
  const e = new EmbedBuilder()
    .setColor(0x57f287 as ColorResolvable)
    .setDescription(`> ✅  ${description}`)
    .setFooter(footer())
    .setTimestamp();
  if (title) e.setTitle(title);
  return e;
}

// ─── Error ────────────────────────────────────────────────────────────────
export function errorEmbed(description: string, title?: string): EmbedBuilder {
  const e = new EmbedBuilder()
    .setColor(0xed4245 as ColorResolvable)
    .setDescription(`> ❌  ${description}`)
    .setFooter(footer())
    .setTimestamp();
  if (title) e.setTitle(title);
  return e;
}

// ─── Info / General ────────────────────────────────────────────────────────
export function infoEmbed(title: string, description?: string): EmbedBuilder {
  const e = new EmbedBuilder()
    .setColor(BRAND.color as ColorResolvable)
    .setTitle(title)
    .setFooter(footer())
    .setTimestamp();
  if (description) e.setDescription(description);
  return e;
}

// ─── Warning ──────────────────────────────────────────────────────────────
export function warningEmbed(description: string, title?: string): EmbedBuilder {
  const e = new EmbedBuilder()
    .setColor(0xfee75c as ColorResolvable)
    .setDescription(`> ⚠️  ${description}`)
    .setFooter(footer())
    .setTimestamp();
  if (title) e.setTitle(title);
  return e;
}

// ─── Antinuke Alert ───────────────────────────────────────────────────────
export function antinukeEmbed(
  action: string,
  offenderId: string,
  punishment: string,
  reason: string,
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xff0000 as ColorResolvable)
    .setTitle("⚡  Antinuke — Action Taken")
    .setDescription(
      `An unauthorized action was detected and intercepted.\n\u200b`,
    )
    .addFields(
      { name: "📌  Action", value: `\`\`\`${action}\`\`\``, inline: true },
      { name: "👤  Offender", value: `<@${offenderId}>\n\`${offenderId}\``, inline: true },
      { name: "⚖️  Punishment", value: `\`\`\`${punishment}\`\`\``, inline: true },
      { name: "📋  Reason", value: `> ${reason}` },
    )
    .setFooter(footer("Protection"))
    .setTimestamp();
}

// ─── Antinuke Status (Xeiron style) ───────────────────────────────────────
export function antinukeStatusEmbed(
  enabled: boolean,
  punishment: string,
  interval: number,
  maxBans: number,
  maxKicks: number,
  maxChDel: number,
  maxRoleDel: number,
): EmbedBuilder {
  const dot = enabled ? "🟢" : "🔴";
  const label = enabled ? "Enabled" : "Disabled";

  return new EmbedBuilder()
    .setColor((enabled ? 0x57f287 : 0xed4245) as ColorResolvable)
    .setTitle("⚡  Antinuke — Status")
    .setDescription(
      `${dot}  **Status —** ${label}\n` +
      `\u200b`,
    )
    .addFields(
      { name: "⚖️  Punishment", value: `\`${punishment}\``, inline: true },
      { name: "⏱️  Interval", value: `\`${interval}s\``, inline: true },
      { name: "\u200b", value: "\u200b", inline: true },
      { name: "🔨  Max Bans", value: `\`${maxBans}\``, inline: true },
      { name: "👢  Max Kicks", value: `\`${maxKicks}\``, inline: true },
      { name: "\u200b", value: "\u200b", inline: true },
      { name: "📁  Max Ch. Deletes", value: `\`${maxChDel}\``, inline: true },
      { name: "🏷️  Max Role Deletes", value: `\`${maxRoleDel}\``, inline: true },
      { name: "\u200b", value: "\u200b", inline: true },
    )
    .setFooter(footer("Protection"))
    .setTimestamp();
}

// ─── Lockdown ─────────────────────────────────────────────────────────────
export function lockdownEmbed(active: boolean): EmbedBuilder {
  return new EmbedBuilder()
    .setColor((active ? 0xff0000 : 0x57f287) as ColorResolvable)
    .setTitle(active ? "🔒  Anti-Raid — Lockdown Active" : "🔓  Anti-Raid — Lockdown Lifted")
    .setDescription(
      active
        ? `> Mass join wave detected!\n> All text channels have been **locked**.\n> Use \`/antiraid unlock\` to restore access.`
        : `> The server has been **unlocked**.\n> All channels are back to normal.`,
    )
    .setFooter(footer("Anti-Raid"))
    .setTimestamp();
}

// ─── Level Up ─────────────────────────────────────────────────────────────
export function levelUpEmbed(userId: string, level: number, avatarUrl?: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x9b59b6 as ColorResolvable)
    .setTitle("⬆️  Level Up!")
    .setDescription(
      `<@${userId}> just leveled up!\n\n` +
      `🎖️  **New Level — ${level}**`,
    )
    .setThumbnail(avatarUrl ?? null)
    .setFooter(footer("Leveling"))
    .setTimestamp();
}

// ─── Rank Card ────────────────────────────────────────────────────────────
export function rankEmbed(
  username: string,
  avatarUrl: string,
  level: number,
  xp: number,
  totalXp: number,
  nextLevelXp: number,
): EmbedBuilder {
  const fill = Math.min(20, Math.floor((xp / nextLevelXp) * 20));
  const bar = "▰".repeat(fill) + "▱".repeat(20 - fill);
  const pct = Math.floor((xp / nextLevelXp) * 100);

  return new EmbedBuilder()
    .setColor(0x9b59b6 as ColorResolvable)
    .setAuthor({ name: `${username}  •  Rank Card`, iconURL: avatarUrl })
    .setThumbnail(avatarUrl)
    .addFields(
      { name: "🎖️  Level", value: `**${level}**`, inline: true },
      { name: "⭐  XP", value: `**${xp.toLocaleString()}** / **${nextLevelXp.toLocaleString()}**`, inline: true },
      { name: "📊  Total XP", value: `**${totalXp.toLocaleString()}**`, inline: true },
      {
        name: `Progress  —  ${pct}%`,
        value: `\`${bar}\``,
        inline: false,
      },
    )
    .setFooter(footer("Leveling"))
    .setTimestamp();
}

// ─── Balance ──────────────────────────────────────────────────────────────
export function balanceEmbed(
  username: string,
  avatarUrl: string,
  wallet: number,
  bank: number,
  currency: string,
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xf1c40f as ColorResolvable)
    .setAuthor({ name: `${username}  •  Balance`, iconURL: avatarUrl })
    .setThumbnail(avatarUrl)
    .addFields(
      { name: `${currency}  Wallet`, value: `\`\`\`${wallet.toLocaleString()}\`\`\``, inline: true },
      { name: `🏦  Bank`, value: `\`\`\`${bank.toLocaleString()}\`\`\``, inline: true },
      { name: `💎  Net Worth`, value: `\`\`\`${(wallet + bank).toLocaleString()}\`\`\``, inline: true },
    )
    .setFooter(footer("Economy"))
    .setTimestamp();
}

// ─── Giveaway ─────────────────────────────────────────────────────────────
export function giveawayEmbed(
  prize: string,
  winnersCount: number,
  hostId: string,
  endsAt: Date,
  entries: number,
  requirements?: string | null,
): EmbedBuilder {
  const e = new EmbedBuilder()
    .setColor(0xf1c40f as ColorResolvable)
    .setTitle(`🎉  Giveaway`)
    .setDescription(`**${prize}**\n\u200b`)
    .addFields(
      { name: "🎟️  Entries", value: `\`${entries}\``, inline: true },
      { name: "👑  Winners", value: `\`${winnersCount}\``, inline: true },
      { name: "🎙️  Host", value: `<@${hostId}>`, inline: true },
      { name: "⏰  Ends", value: `<t:${Math.floor(endsAt.getTime() / 1000)}:R>`, inline: true },
    )
    .setFooter(footer("Giveaways  •  Click 🎉 to enter"))
    .setTimestamp(endsAt);

  if (requirements) e.addFields({ name: "📋  Requirements", value: `> ${requirements}` });
  return e;
}

export function giveawayEndedEmbed(
  prize: string,
  winners: string[],
  hostId: string,
  totalEntries: number,
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor((winners.length > 0 ? 0x57f287 : 0xed4245) as ColorResolvable)
    .setTitle("🎉  Giveaway — Ended")
    .setDescription(`**${prize}**\n\u200b`)
    .addFields(
      {
        name: "🥇  Winners",
        value: winners.length > 0
          ? winners.map(w => `<@${w}>`).join("  •  ")
          : "*No winners — no one entered.*",
      },
      { name: "🎙️  Host", value: `<@${hostId}>`, inline: true },
      { name: "🎟️  Total Entries", value: `\`${totalEntries}\``, inline: true },
    )
    .setFooter(footer("Giveaways"))
    .setTimestamp();
}

// ─── Ticket Panel ─────────────────────────────────────────────────────────
export function ticketPanelEmbed(serverName: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x5865f2 as ColorResolvable)
    .setTitle("🎫  Support Tickets")
    .setDescription(
      `Welcome to **${serverName}** support!\n` +
      `Click the button below to open a private ticket.\n\u200b`,
    )
    .addFields({
      name: "📋  How it works",
      value:
        "> **1.** Click **Open Ticket** below\n" +
        "> **2.** Describe your issue in detail\n" +
        "> **3.** A staff member will respond shortly",
    })
    .setFooter(footer("Tickets"))
    .setTimestamp();
}

export function ticketEmbed(ticketNum: number, userId: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x5865f2 as ColorResolvable)
    .setTitle(`🎫  Ticket  #${ticketNum}`)
    .setDescription(
      `Hello <@${userId}>!\nOur staff will be with you shortly.\n\u200b`,
    )
    .addFields(
      { name: "👤  Opened by", value: `<@${userId}>`, inline: true },
      { name: "📌  Status", value: "`Open`", inline: true },
    )
    .setFooter(footer("Tickets"))
    .setTimestamp();
}

// ─── Verification ─────────────────────────────────────────────────────────
export function verifyEmbed(serverName: string, code: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x5865f2 as ColorResolvable)
    .setTitle("🔐  Verification Required")
    .setDescription(
      `Welcome to **${serverName}**!\n\u200b`,
    )
    .addFields(
      {
        name: "📋  Your Code",
        value: `\`\`\`${code}\`\`\``,
      },
      {
        name: "📌  Instructions",
        value:
          "> Click **Enter Code** below\n" +
          "> **Type** the code manually — do not copy-paste\n" +
          "> ⏱️ Expires in **5 minutes**  •  ⚠️ **3 attempts** max",
      },
    )
    .setFooter(footer("Verification"))
    .setTimestamp();
}
