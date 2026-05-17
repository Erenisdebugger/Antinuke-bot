import { Message, EmbedBuilder, TextChannel, GuildMember } from "discord.js";
import { getOrCreateUserLevel, updateUserLevel, getTopLevels, getLevelRoles } from "../database.js";
import { getGuildSettings } from "../database.js";
import { COLORS, XP_PER_MESSAGE, XP_COOLDOWN_SECONDS, xpForLevel, levelFromXp } from "../config.js";
import { levelUpEmbed, rankEmbed, BRAND } from "../embed.js";
import { logger } from "../../lib/logger.js";

export async function handleMessageXP(message: Message): Promise<void> {
  if (!message.guild || message.author.bot) return;

  const userLevel = await getOrCreateUserLevel(message.guild.id, message.author.id);
  const now = new Date();

  if (userLevel.lastMessageAt) {
    const diff = (now.getTime() - userLevel.lastMessageAt.getTime()) / 1000;
    if (diff < XP_COOLDOWN_SECONDS) return;
  }

  const xpGain = Math.floor(Math.random() * (XP_PER_MESSAGE.max - XP_PER_MESSAGE.min + 1)) + XP_PER_MESSAGE.min;
  const newTotalXp = userLevel.totalXp + xpGain;

  let currentXp = userLevel.xp + xpGain;
  let currentLevel = userLevel.level;
  let leveledUp = false;

  while (currentXp >= xpForLevel(currentLevel)) {
    currentXp -= xpForLevel(currentLevel);
    currentLevel++;
    leveledUp = true;
  }

  await updateUserLevel(message.guild.id, message.author.id, {
    xp: currentXp,
    level: currentLevel,
    totalXp: newTotalXp,
    lastMessageAt: now,
  });

  if (leveledUp) {
    const settings = await getGuildSettings(message.guild.id);
    const levelUpChannel = settings.logChannelId
      ? message.guild.channels.cache.get(settings.logChannelId) as TextChannel | undefined
      : message.channel as TextChannel;

    const targetChannel = levelUpChannel ?? (message.channel as TextChannel);

    await targetChannel.send({
      embeds: [levelUpEmbed(message.author.id, currentLevel, message.author.displayAvatarURL())],
    }).catch(() => {});

    // Assign level roles
    try {
      const levelRoles = await getLevelRoles(message.guild.id);
      const member = message.member;
      if (member) {
        for (const lr of levelRoles) {
          if (currentLevel >= lr.level) {
            const role = message.guild.roles.cache.get(lr.roleId);
            if (role && !member.roles.cache.has(lr.roleId)) {
              await member.roles.add(role, `Reached level ${lr.level}`).catch(() => {});
            }
          }
        }
      }
    } catch (err) {
      logger.warn({ err }, "Failed to assign level role");
    }
  }
}

export function buildRankEmbed(member: GuildMember, level: number, xp: number, totalXp: number, nextLevelXp: number): EmbedBuilder {
  return rankEmbed(member.user.username, member.user.displayAvatarURL({ size: 256 }), level, xp, totalXp, nextLevelXp);
}

export async function buildLeaderboard(guildId: string, guildName: string): Promise<EmbedBuilder> {
  const top = await getTopLevels(guildId, 10);
  const medals = ["🥇", "🥈", "🥉"];
  const desc = top.length === 0
    ? "No data yet. Start chatting to earn XP!"
    : top.map((u, i) => `${medals[i] ?? `**${i + 1}.**`} <@${u.userId}> — Level **${u.level}** • \`${u.totalXp.toLocaleString()} XP\``).join("\n");

  return new EmbedBuilder()
    .setColor(0x9b59b6)
    .setTitle(`🏆 ${guildName} — Level Leaderboard`)
    .setDescription(desc)
    .setFooter({ text: `${BRAND.name} Leveling`, iconURL: BRAND.icon ?? undefined })
    .setTimestamp();
}
