import {
  Guild, GuildMember, User, PermissionFlagsBits,
  AuditLogEvent, TextChannel, EmbedBuilder, Role,
  GuildChannel,
} from "discord.js";
import { getAntiNukeConfig, isWhitelisted, isExtraOwner, getGuildSettings } from "../database.js";
import { COLORS, UNIVERSAL_OWNER_ID } from "../config.js";
import { antinukeEmbed } from "../embed.js";
import { logger } from "../../lib/logger.js";

export type AntiNukeAction =
  | "ban" | "kick" | "prune" | "botAdd" | "serverUpdate" | "memberRoleUpdate"
  | "channelCreate" | "channelDelete" | "channelUpdate"
  | "roleCreate" | "roleDelete" | "roleUpdate"
  | "mentionEveryone"
  | "webhookCreate" | "webhookDelete"
  | "emojiCreate" | "emojiDelete"
  | "stickerCreate" | "stickerDelete";

interface ActionEntry {
  timestamps: number[];
}

const actionMap = new Map<string, Map<string, ActionEntry>>();

function getActionKey(guildId: string, userId: string, action: string) {
  return `${guildId}:${userId}:${action}`;
}

function trackAction(guildId: string, userId: string, action: string, intervalMs: number): number {
  const key = getActionKey(guildId, userId, action);
  if (!actionMap.has(guildId)) actionMap.set(guildId, new Map());
  const gMap = actionMap.get(guildId)!;
  if (!gMap.has(key)) gMap.set(key, { timestamps: [] });
  const entry = gMap.get(key)!;
  const now = Date.now();
  entry.timestamps = entry.timestamps.filter(t => now - t < intervalMs);
  entry.timestamps.push(now);
  return entry.timestamps.length;
}

export function clearActions(guildId: string, userId: string) {
  const gMap = actionMap.get(guildId);
  if (!gMap) return;
  for (const key of gMap.keys()) {
    if (key.startsWith(`${guildId}:${userId}:`)) gMap.delete(key);
  }
}

export async function isTrustedUser(guild: Guild, userId: string): Promise<boolean> {
  if (userId === UNIVERSAL_OWNER_ID) return true;
  if (guild.ownerId === userId) return true;
  if (await isExtraOwner(guild.id, userId)) return true;
  if (await isWhitelisted(guild.id, userId)) return true;
  return false;
}

async function punishUser(
  guild: Guild,
  userId: string,
  action: string,
  punishAction: string,
  reason: string,
  targetDesc?: string,
) {
  try {
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) {
      // Try to ban even if not in cache (already left)
      if (punishAction === "ban") {
        await guild.bans.create(userId, { reason: `[ANTINUKE] ${reason}` });
      }
      return;
    }
    if (member.id === guild.ownerId || member.id === UNIVERSAL_OWNER_ID) return;

    logger.info({ guildId: guild.id, userId, action, punishAction }, "Antinuke punishment");

    if (punishAction === "ban") {
      await guild.bans.create(userId, { reason: `[ANTINUKE] ${reason}` });
    } else if (punishAction === "kick") {
      await member.kick(`[ANTINUKE] ${reason}`);
    } else if (punishAction === "strip_roles") {
      await member.roles.set([], `[ANTINUKE] ${reason}`);
    } else if (punishAction === "deafen") {
      if (member.voice.channel) await member.voice.setDeaf(true, `[ANTINUKE] ${reason}`);
    }

    clearActions(guild.id, userId);

    const settings = await getGuildSettings(guild.id);
    if (settings.logChannelId) {
      const logCh = guild.channels.cache.get(settings.logChannelId) as TextChannel | undefined;
      if (logCh) {
        await logCh.send({
          embeds: [antinukeEmbed(guild.name, action, userId, punishAction, targetDesc)],
        });
      }
    }
  } catch (err) {
    logger.error({ err, guildId: guild.id, userId }, "Failed to punish antinuke offender");
  }
}

export async function checkAction(
  guild: Guild,
  userId: string,
  action: AntiNukeAction,
  targetDesc?: string,
): Promise<boolean> {
  if (await isTrustedUser(guild, userId)) return false;

  const cfg = await getAntiNukeConfig(guild.id);
  const settings = await getGuildSettings(guild.id);
  if (!settings.antiNukeEnabled) return false;

  // Per-module enable check
  const moduleEnabled: Record<string, boolean> = {
    ban: cfg.antiBan,
    kick: cfg.antiKick,
    prune: cfg.antiPrune,
    botAdd: cfg.antiBotAdd,
    serverUpdate: cfg.antiServerUpdate,
    memberRoleUpdate: cfg.antiMemberRoleUpdate,
    channelCreate: cfg.antiChannelCreate,
    channelDelete: cfg.antiChannelDelete,
    channelUpdate: cfg.antiChannelUpdate,
    roleCreate: cfg.antiRoleCreate,
    roleDelete: cfg.antiRoleDelete,
    roleUpdate: cfg.antiRoleUpdate,
    mentionEveryone: cfg.antiMentionEveryone,
    webhookCreate: cfg.antiWebhookCreate,
    webhookDelete: cfg.antiWebhookDelete,
    emojiCreate: cfg.antiEmojiCreate,
    emojiDelete: cfg.antiEmojiDelete,
    stickerCreate: cfg.antiStickerCreate,
    stickerDelete: cfg.antiStickerDelete,
  };
  if (!moduleEnabled[action]) return false;

  // Per-action configurable limits (0 = zero tolerance = ban on 1st action)
  const limits: Record<string, number> = {
    ban: cfg.maxBans,
    kick: cfg.maxKicks,
    prune: cfg.maxKicks,
    channelDelete: cfg.maxChannelDelete,
    channelCreate: cfg.maxChannelCreate,
    roleDelete: cfg.maxRoleDelete,
    roleCreate: cfg.maxRoleCreate,
    webhookCreate: cfg.maxWebhookCreate,
    webhookDelete: cfg.maxWebhookCreate,
    mentionEveryone: cfg.maxMentions,
  };
  // Actions not listed above default to 0 = immediate action
  const limit = limits[action] ?? 0;
  const intervalMs = cfg.intervalSeconds * 1000;
  const count = trackAction(guild.id, userId, action, intervalMs);

  // threshold: 0 = ban on 1st (count=1), N = ban when count reaches N
  const threshold = limit === 0 ? 1 : limit;

  if (count >= threshold) {
    const reasons: Record<string, string> = {
      ban: `Mass ban detected (${count} bans)`,
      kick: `Mass kick detected (${count} kicks)`,
      prune: `Mass prune detected`,
      botAdd: `Unauthorized bot added`,
      serverUpdate: `Unauthorized server update`,
      memberRoleUpdate: `Unauthorized member role update`,
      channelDelete: `Mass channel deletion (${count} channels)`,
      channelCreate: `Mass channel creation (${count} channels)`,
      channelUpdate: `Unauthorized channel update`,
      roleDelete: `Mass role deletion (${count} roles)`,
      roleCreate: `Mass role creation (${count} roles)`,
      roleUpdate: `Unauthorized role update`,
      mentionEveryone: `Mass mention spam`,
      webhookCreate: `Unauthorized webhook creation`,
      webhookDelete: `Unauthorized webhook deletion`,
      emojiCreate: `Unauthorized emoji creation`,
      emojiDelete: `Unauthorized emoji deletion`,
      stickerCreate: `Unauthorized sticker creation`,
      stickerDelete: `Unauthorized sticker deletion`,
    };
    await punishUser(guild, userId, action, cfg.punishAction, reasons[action] ?? "Suspicious activity", targetDesc);
    return true;
  }
  return false;
}

export async function getAuditLogUser(guild: Guild, event: AuditLogEvent): Promise<string | null> {
  try {
    const logs = await guild.fetchAuditLogs({ limit: 1, type: event });
    const entry = logs.entries.first();
    if (!entry) return null;
    if (Date.now() - entry.createdTimestamp > 5000) return null;
    return entry.executor?.id ?? null;
  } catch {
    return null;
  }
}
