import { EmbedBuilder, Client, ColorResolvable, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

// ─── Brand ─────────────────────────────────────────────────────────────────
export const BRAND = {
  name: "Shonargaon Antinuke",
  color: 0x000000 as number,
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
// TOGGLE — Enable / Disable
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function toggleEmbed(
  module: string,
  enabled: boolean,
  extras?: { name: string; value: string; inline?: boolean }[],
): EmbedBuilder {
  const e = new EmbedBuilder()
    .setColor((enabled ? C.green : C.red) as ColorResolvable)
    .setTitle(module)
    .setDescription(`**Status**\n${enabled ? "🟢  Enabled" : "🔴  Disabled"}\n\u200b`)
    .setFooter(footer())
    .setTimestamp();
  if (extras?.length) e.addFields(extras);
  return e;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANTINUKE STATUS — Xeiron-style full module list
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type AntiNukeCfg = {
  antiBan: boolean; antiKick: boolean; antiPrune: boolean; antiBotAdd: boolean;
  antiServerUpdate: boolean; antiMemberRoleUpdate: boolean;
  antiChannelCreate: boolean; antiChannelDelete: boolean; antiChannelUpdate: boolean;
  antiRoleCreate: boolean; antiRoleDelete: boolean; antiRoleUpdate: boolean;
  antiMentionEveryone: boolean;
  antiWebhookCreate: boolean; antiWebhookDelete: boolean;
  antiEmojiCreate: boolean; antiEmojiDelete: boolean;
  antiStickerCreate: boolean; antiStickerDelete: boolean;
  punishAction: string; maxBans: number; maxKicks: number;
  maxChannelDelete: number; maxRoleDelete: number;
};

const MOD = (on: boolean) => on ? "✅" : "❌";

export function antinukeStatusEmbed(guildName: string, enabled: boolean, cfg: AntiNukeCfg): EmbedBuilder {
  const modules: [string, boolean][] = [
    ["Anti Ban",                  cfg.antiBan],
    ["Anti Kick",                 cfg.antiKick],
    ["Anti Prune",                cfg.antiPrune],
    ["Anti Bot Add",              cfg.antiBotAdd],
    ["Anti Server Update",        cfg.antiServerUpdate],
    ["Anti Member Role Update",   cfg.antiMemberRoleUpdate],
    ["Anti Channel Create",       cfg.antiChannelCreate],
    ["Anti Channel Delete",       cfg.antiChannelDelete],
    ["Anti Channel Update",       cfg.antiChannelUpdate],
    ["Anti Role Create",          cfg.antiRoleCreate],
    ["Anti Role Delete",          cfg.antiRoleDelete],
    ["Anti Role Update",          cfg.antiRoleUpdate],
    ["Anti @everyone/here Ping",  cfg.antiMentionEveryone],
    ["Anti Webhook Create",       cfg.antiWebhookCreate],
    ["Anti Webhook Delete",       cfg.antiWebhookDelete],
    ["Anti Emoji Create",         cfg.antiEmojiCreate],
    ["Anti Emoji Delete",         cfg.antiEmojiDelete],
    ["Anti Sticker Create",       cfg.antiStickerCreate],
    ["Anti Sticker Delete",       cfg.antiStickerDelete],
  ];

  const list = modules.map(([name, on]) => `${MOD(on)}  ${name}`).join("\n");

  return new EmbedBuilder()
    .setColor((enabled ? C.green : C.red) as ColorResolvable)
    .setTitle(`Security Settings For ${guildName}  🛡️`)
    .setDescription(
      `> ⚠️  For maximum security efficiency, ensure my role maintains the **highest position** in the role hierarchy.\n\n` +
      `**__Modules Enabled__**\n${list}`,
    )
    .addFields(
      { name: "Punishment",   value: `\`${cfg.punishAction.toUpperCase()}\``,  inline: true },
      { name: "Status",       value: enabled ? "🟢  Active" : "🔴  Disabled",  inline: true },
    )
    .setFooter(footer("Protection"))
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANTINUKE ALERT — Xeiron-style with executor/target
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ACTION_LABELS: Record<string, string> = {
  ban: "Ban", kick: "Kick", prune: "Prune", botAdd: "Bot Add",
  serverUpdate: "Server Update", memberRoleUpdate: "Member Role Update",
  channelCreate: "Channel Create", channelDelete: "Channel Delete", channelUpdate: "Channel Update",
  roleCreate: "Role Create", roleDelete: "Role Delete", roleUpdate: "Role Update",
  mentionEveryone: "Mention @everyone",
  webhookCreate: "Webhook Create", webhookDelete: "Webhook Delete",
  emojiCreate: "Emoji Create", emojiDelete: "Emoji Delete",
  stickerCreate: "Sticker Create", stickerDelete: "Sticker Delete",
};

const ALL_ACTIONS = Object.keys(ACTION_LABELS);

export function antinukeEmbed(
  guildName: string,
  action: string,
  offenderId: string,
  punishment: string,
  targetDesc?: string,
): EmbedBuilder {
  const moduleLines = ALL_ACTIONS.map(a =>
    `${a === action ? "❌" : "✅"}  ✅ : ${ACTION_LABELS[a]}`,
  ).join("\n");

  const e = new EmbedBuilder()
    .setColor(C.red as ColorResolvable)
    .setAuthor({ name: `🔒  ${guildName}`, iconURL: BRAND.icon ?? undefined })
    .setDescription(moduleLines)
    .addFields(
      { name: "Executor",   value: `<@${offenderId}>`,  inline: true },
      { name: "Punishment", value: `\`${punishment.toUpperCase()}\``, inline: true },
    );

  if (targetDesc) e.addFields({ name: "Target", value: targetDesc, inline: true });

  e.setFooter({ text: `Shonargaon Antinuke  ·  Developed with ❤️  by Shonargaon Dev`, iconURL: BRAND.icon ?? undefined })
    .setTimestamp();
  return e;
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
  username: string, avatarUrl: string, level: number,
  xp: number, totalXp: number, nextLevelXp: number,
): EmbedBuilder {
  const fill = Math.min(15, Math.floor((xp / nextLevelXp) * 15));
  const bar = "█".repeat(fill) + "░".repeat(15 - fill);
  const pct = Math.floor((xp / nextLevelXp) * 100);
  return new EmbedBuilder()
    .setColor(C.black as ColorResolvable)
    .setAuthor({ name: username, iconURL: avatarUrl })
    .setThumbnail(avatarUrl)
    .addFields(
      { name: "Level",    value: `**${level}**`,                                                    inline: true },
      { name: "XP",       value: `**${xp.toLocaleString()} / ${nextLevelXp.toLocaleString()}**`,    inline: true },
      { name: "Total XP", value: `**${totalXp.toLocaleString()}**`,                                 inline: true },
      { name: `Progress — ${pct}%`, value: `\`${bar}\`` },
    )
    .setFooter(footer("Leveling"))
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BALANCE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function balanceEmbed(
  username: string, avatarUrl: string, wallet: number, bank: number, currency: string,
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(C.black as ColorResolvable)
    .setAuthor({ name: `${username} — Balance`, iconURL: avatarUrl })
    .setThumbnail(avatarUrl)
    .addFields(
      { name: `${currency} Wallet`,  value: `\`${wallet.toLocaleString()}\``,           inline: true },
      { name: "Bank",                value: `\`${bank.toLocaleString()}\``,              inline: true },
      { name: "Net Worth",           value: `\`${(wallet + bank).toLocaleString()}\``,  inline: true },
    )
    .setFooter(footer("Economy"))
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GIVEAWAY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function giveawayEmbed(
  prize: string, winnersCount: number, hostId: string, endsAt: Date, entries: number, requirements?: string | null,
): EmbedBuilder {
  const e = new EmbedBuilder()
    .setColor(C.gold as ColorResolvable)
    .setTitle("Giveaway")
    .setDescription(`**${prize}**\n\u200b`)
    .addFields(
      { name: "Entries",  value: `\`${entries}\``,                                             inline: true },
      { name: "Winners",  value: `\`${winnersCount}\``,                                        inline: true },
      { name: "Host",     value: `<@${hostId}>`,                                               inline: true },
      { name: "Ends",     value: `<t:${Math.floor(endsAt.getTime() / 1000)}:R>`,              inline: true },
    )
    .setFooter(footer("Click 🎉 to enter"))
    .setTimestamp(endsAt);
  if (requirements) e.addFields({ name: "Requirements", value: requirements });
  return e;
}

export function giveawayEndedEmbed(prize: string, winners: string[], hostId: string, totalEntries: number): EmbedBuilder {
  return new EmbedBuilder()
    .setColor((winners.length > 0 ? C.green : C.red) as ColorResolvable)
    .setTitle("Giveaway — Ended")
    .setDescription(`**${prize}**\n\u200b`)
    .addFields(
      { name: "Winners", value: winners.length > 0 ? winners.map(w => `<@${w}>`).join("  ·  ") : "No winners — no one entered." },
      { name: "Host",          value: `<@${hostId}>`,        inline: true },
      { name: "Total Entries", value: `\`${totalEntries}\``, inline: true },
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
    .addFields({ name: "How it works", value: "1. Click **Open Ticket** below\n2. Describe your issue clearly\n3. A staff member will respond shortly" })
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
      { name: "Your Code", value: `\`\`\`${code}\`\`\`` },
      { name: "Instructions", value: "Click **Enter Code** and type the code above\n⏱️ Expires in **5 minutes**  ·  ⚠️ **3 attempts** max" },
    )
    .setFooter(footer("Verification"))
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELP — Command centre (reusable in /help, mention, guildCreate)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function buildHelpEmbed(client: Client): {
  embed: EmbedBuilder;
  row: ActionRowBuilder<ButtonBuilder>;
} {
  const totalGuilds = client.guilds.cache.size;
  const totalUsers  = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
  const ping        = Math.round(client.ws.ping);
  const upMs        = client.uptime ?? 0;
  const upSec       = Math.floor(upMs / 1000);
  const upMin       = Math.floor(upSec / 60);
  const upHr        = Math.floor(upMin / 60);
  const upDay       = Math.floor(upHr / 24);
  const uptimeStr   =
    upDay > 0 ? `${upDay}d ${upHr % 24}h ${upMin % 60}m` :
    upHr  > 0 ? `${upHr}h ${upMin % 60}m ${upSec % 60}s` :
                `${upMin}m ${upSec % 60}s`;

  const statusBlock = [
    "root@keren-os:~# ./botinfo --status",
    "",
    "  BOT        : Shonargaon Antinuke",
    "  AI         : Keren OS v1.0  [SELF-LEARNING]",
    "  DEV        : KAZI EREN",
    `  SERVERS    : ${totalGuilds}`,
    `  USERS      : ${totalUsers.toLocaleString()}`,
    `  PING       : ${ping}ms`,
    `  UPTIME     : ${uptimeStr}`,
    "",
    "root@keren-os:~# All systems nominal.",
    "root@keren-os:~# █",
  ].join("\n");

  const embed = new EmbedBuilder()
    .setColor(C.black as ColorResolvable)
    .setAuthor({ name: "Shonargaon Antinuke — Command Center", iconURL: BRAND.icon ?? undefined })
    .setThumbnail(BRAND.icon)
    .setDescription(`\`\`\`\n${statusBlock}\n\`\`\``)
    .addFields(
      {
        name: "🛡️  Protection",
        value: "`/antinuke`  `/whitelist`\n`/extraowner`  `/lockdown`\n`/recover`",
        inline: true,
      },
      {
        name: "📋  Logging & Setup",
        value: "`/logging setup`\n`/logging status`\n`/welcome`  `/goodbye`\n`/autorole`  `/ticket`",
        inline: true,
      },
      {
        name: "🏷️  Roles & Access",
        value: "`/reactionrole`\n`/unbypssablerole`\n`/verification`\n`/antiraid`",
        inline: true,
      },
      {
        name: "🎉  Fun & XP",
        value: "`/giveaway`  `/rank`\n`/leaderboard`\n`/economy daily`\n`/economy balance`",
        inline: true,
      },
      {
        name: "📝  Utility",
        value: "`/tag`  `/userinfo`\n`/serverinfo`  `/ping`\n`/help`  `/dev`",
        inline: true,
      },
      {
        name: "💡  Tip",
        value: "Type `/` in Discord to see all commands.\nMention me anytime to see this panel.",
        inline: true,
      },
    )
    .setFooter({ text: "Keren OS v1.0  ·  Autonomous Intelligence Layer  ·  Shonargaon Antinuke", iconURL: BRAND.icon ?? undefined })
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("help:dev_terminal")
      .setLabel("Developer Terminal")
      .setEmoji("💻")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("help:antinuke_info")
      .setLabel("Antinuke Info")
      .setEmoji("🛡️")
      .setStyle(ButtonStyle.Secondary),
  );

  return { embed, row };
}
