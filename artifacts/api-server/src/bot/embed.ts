import { EmbedBuilder, Client, ColorResolvable } from "discord.js";

// ─── Brand ─────────────────────────────────────────────────────────────────
export const BRAND = {
  name: "Shonargaon Antinuke",
  color: 0x000000 as number,   // Black sidebar — Xeiron style
  icon: null as string | null,
};

export function setBotIcon(client: Client) {
  BRAND.icon = client.user?.displayAvatarURL({ size: 64 }) ?? null;
}

// ─── Palette ───────────────────────────────────────────────────────────────
const C = {
  black:   0x000000,
  green:   0x57f287,
  red:     0xed4245,
  yellow:  0xfee75c,
  gold:    0xf1c40f,
  purple:  0x9b59b6,
  blurple: 0x5865f2,
} as const;

function footer(tag?: string) {
  return {
    text: tag ? `Shonargaon Antinuke  ·  ${tag}` : "Shonargaon Antinuke",
    iconURL: BRAND.icon ?? undefined,
  };
}

function base(color: number): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(color as ColorResolvable)
    .setFooter(footer())
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOGGLE — Enable / Disable (Xeiron-style)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function toggleEmbed(
  module: string,
  enabled: boolean,
  extras?: { name: string; value: string; inline?: boolean }[],
): EmbedBuilder {
  const color = enabled ? C.green : C.red;
  const status = enabled
    ? "<:online:1> **Enabled**"
    : "<:offline:1> **Disabled**";

  const e = new EmbedBuilder()
    .setColor(color as ColorResolvable)
    .setTitle(module)
    .setDescription(`**Status**\n${enabled ? "🟢" : "🔴"}  ${enabled ? "Enabled" : "Disabled"}\n\u200b`)
    .setFooter(footer())
    .setTimestamp();

  if (extras?.length) e.addFields(extras);
  return e;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANTINUKE STATUS — Full config panel (Xeiron-style)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function antinukeStatusEmbed(
  enabled: boolean,
  punishment: string,
  interval: number,
  maxBans: number,
  maxKicks: number,
  maxChDel: number,
  maxRoleDel: number,
): EmbedBuilder {
  const color = enabled ? C.green : C.red;

  return new EmbedBuilder()
    .setColor(color as ColorResolvable)
    .setTitle("Antinuke — Configuration")
    .setDescription(
      `**Status**\n` +
      `${enabled ? "🟢  Enabled" : "🔴  Disabled"}\n` +
      `\u200b`,
    )
    .addFields(
      { name: "Punishment",       value: `\`${punishment}\``,  inline: true },
      { name: "Interval",         value: `\`${interval}s\``,   inline: true },
      { name: "\u200b",           value: "\u200b",              inline: true },
      { name: "Max Bans",         value: `\`${maxBans}\``,     inline: true },
      { name: "Max Kicks",        value: `\`${maxKicks}\``,    inline: true },
      { name: "\u200b",           value: "\u200b",              inline: true },
      { name: "Ch. Deletes",      value: `\`${maxChDel}\``,   inline: true },
      { name: "Role Deletes",     value: `\`${maxRoleDel}\``, inline: true },
      { name: "\u200b",           value: "\u200b",              inline: true },
    )
    .setFooter(footer("Protection"))
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUCCESS / ERROR / INFO / WARNING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function successEmbed(description: string, title?: string): EmbedBuilder {
  const e = new EmbedBuilder()
    .setColor(C.green as ColorResolvable)
    .setDescription(`✅  ${description}`)
    .setFooter(footer())
    .setTimestamp();
  if (title) e.setTitle(title);
  return e;
}

export function errorEmbed(description: string, title?: string): EmbedBuilder {
  const e = new EmbedBuilder()
    .setColor(C.red as ColorResolvable)
    .setDescription(`❌  ${description}`)
    .setFooter(footer())
    .setTimestamp();
  if (title) e.setTitle(title);
  return e;
}

export function infoEmbed(title: string, description?: string): EmbedBuilder {
  const e = new EmbedBuilder()
    .setColor(C.black as ColorResolvable)
    .setTitle(title)
    .setFooter(footer())
    .setTimestamp();
  if (description) e.setDescription(description);
  return e;
}

export function warningEmbed(description: string, title?: string): EmbedBuilder {
  const e = new EmbedBuilder()
    .setColor(C.yellow as ColorResolvable)
    .setDescription(`⚠️  ${description}`)
    .setFooter(footer())
    .setTimestamp();
  if (title) e.setTitle(title);
  return e;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANTINUKE ALERT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function antinukeEmbed(
  action: string,
  offenderId: string,
  punishment: string,
  reason: string,
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(C.red as ColorResolvable)
    .setTitle("Antinuke — Action Taken")
    .setDescription("An unauthorized action was detected and intercepted.\n\u200b")
    .addFields(
      { name: "Action",     value: `\`${action}\``,            inline: true },
      { name: "Offender",   value: `<@${offenderId}>`,          inline: true },
      { name: "Punishment", value: `\`${punishment}\``,         inline: true },
      { name: "Reason",     value: reason },
    )
    .setFooter(footer("Protection"))
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOCKDOWN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function lockdownEmbed(active: boolean): EmbedBuilder {
  return new EmbedBuilder()
    .setColor((active ? C.red : C.green) as ColorResolvable)
    .setTitle(active ? "Anti-Raid — Lockdown Active" : "Anti-Raid — Lockdown Lifted")
    .setDescription(
      active
        ? "Mass join wave detected.\nAll text channels have been **locked**.\nUse `/antiraid unlock` to restore access."
        : "The lockdown has ended.\nAll channels are back to normal.",
    )
    .setFooter(footer("Anti-Raid"))
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEVEL UP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function levelUpEmbed(userId: string, level: number, avatarUrl?: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(C.purple as ColorResolvable)
    .setTitle("Level Up!")
    .setDescription(`<@${userId}> just leveled up to **Level ${level}**!`)
    .setThumbnail(avatarUrl ?? null)
    .setFooter(footer("Leveling"))
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RANK CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function rankEmbed(
  username: string,
  avatarUrl: string,
  level: number,
  xp: number,
  totalXp: number,
  nextLevelXp: number,
): EmbedBuilder {
  const fill = Math.min(15, Math.floor((xp / nextLevelXp) * 15));
  const bar = "█".repeat(fill) + "░".repeat(15 - fill);
  const pct = Math.floor((xp / nextLevelXp) * 100);

  return new EmbedBuilder()
    .setColor(C.black as ColorResolvable)
    .setAuthor({ name: username, iconURL: avatarUrl })
    .setThumbnail(avatarUrl)
    .addFields(
      { name: "Level",    value: `**${level}**`,                                              inline: true },
      { name: "XP",       value: `**${xp.toLocaleString()} / ${nextLevelXp.toLocaleString()}**`, inline: true },
      { name: "Total XP", value: `**${totalXp.toLocaleString()}**`,                           inline: true },
      { name: `Progress — ${pct}%`, value: `\`${bar}\`` },
    )
    .setFooter(footer("Leveling"))
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BALANCE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function balanceEmbed(
  username: string,
  avatarUrl: string,
  wallet: number,
  bank: number,
  currency: string,
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(C.black as ColorResolvable)
    .setAuthor({ name: `${username} — Balance`, iconURL: avatarUrl })
    .setThumbnail(avatarUrl)
    .addFields(
      { name: `${currency} Wallet`,  value: `\`${wallet.toLocaleString()}\``,          inline: true },
      { name: "Bank",                value: `\`${bank.toLocaleString()}\``,             inline: true },
      { name: "Net Worth",           value: `\`${(wallet + bank).toLocaleString()}\``, inline: true },
    )
    .setFooter(footer("Economy"))
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GIVEAWAY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function giveawayEmbed(
  prize: string,
  winnersCount: number,
  hostId: string,
  endsAt: Date,
  entries: number,
  requirements?: string | null,
): EmbedBuilder {
  const e = new EmbedBuilder()
    .setColor(C.gold as ColorResolvable)
    .setTitle("Giveaway")
    .setDescription(`**${prize}**\n\u200b`)
    .addFields(
      { name: "Entries",  value: `\`${entries}\``,                                              inline: true },
      { name: "Winners",  value: `\`${winnersCount}\``,                                         inline: true },
      { name: "Host",     value: `<@${hostId}>`,                                                inline: true },
      { name: "Ends",     value: `<t:${Math.floor(endsAt.getTime() / 1000)}:R>`,               inline: true },
    )
    .setFooter(footer("Click 🎉 to enter"))
    .setTimestamp(endsAt);

  if (requirements) e.addFields({ name: "Requirements", value: requirements });
  return e;
}

export function giveawayEndedEmbed(
  prize: string,
  winners: string[],
  hostId: string,
  totalEntries: number,
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor((winners.length > 0 ? C.green : C.red) as ColorResolvable)
    .setTitle("Giveaway — Ended")
    .setDescription(`**${prize}**\n\u200b`)
    .addFields(
      {
        name: "Winners",
        value: winners.length > 0
          ? winners.map(w => `<@${w}>`).join("  ·  ")
          : "No winners — no one entered.",
      },
      { name: "Host",          value: `<@${hostId}>`,          inline: true },
      { name: "Total Entries", value: `\`${totalEntries}\``,   inline: true },
    )
    .setFooter(footer("Giveaways"))
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TICKET
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function ticketPanelEmbed(serverName: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(C.black as ColorResolvable)
    .setTitle("Support Tickets")
    .setDescription(
      `Welcome to **${serverName}** support!\n` +
      `Click the button below to open a private ticket.\n\u200b`,
    )
    .addFields({
      name: "How it works",
      value:
        "1. Click **Open Ticket** below\n" +
        "2. Describe your issue clearly\n" +
        "3. A staff member will respond shortly",
    })
    .setFooter(footer("Tickets"))
    .setTimestamp();
}

export function ticketEmbed(ticketNum: number, userId: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(C.black as ColorResolvable)
    .setTitle(`Ticket  #${ticketNum.toString().padStart(4, "0")}`)
    .setDescription(`Hello <@${userId}>!\nOur staff will be with you shortly.\n\u200b`)
    .addFields(
      { name: "Opened by", value: `<@${userId}>`, inline: true },
      { name: "Status",    value: "`Open`",        inline: true },
    )
    .setFooter(footer("Tickets"))
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VERIFICATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function verifyEmbed(serverName: string, code: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(C.black as ColorResolvable)
    .setTitle("Verification Required")
    .setDescription(`Welcome to **${serverName}**!\n\u200b`)
    .addFields(
      {
        name: "Your Code",
        value: `\`\`\`${code}\`\`\``,
      },
      {
        name: "Instructions",
        value:
          "Click **Enter Code** and type the code above\n" +
          "⏱️ Expires in **5 minutes**  ·  ⚠️ **3 attempts** max",
      },
    )
    .setFooter(footer("Verification"))
    .setTimestamp();
}
