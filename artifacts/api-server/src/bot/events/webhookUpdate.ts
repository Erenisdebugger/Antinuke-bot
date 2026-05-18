import { TextChannel, AuditLogEvent } from "discord.js";
import { checkAction, getAuditLogUser } from "../systems/antinuke.js";
import { logger } from "../../lib/logger.js";

export async function onWebhooksUpdate(channel: TextChannel): Promise<void> {
  if (!channel.guild) return;
  try {
    // Check create first, then delete
    const createExecutor = await getAuditLogUser(channel.guild, AuditLogEvent.WebhookCreate);
    if (createExecutor && createExecutor !== channel.guild.client.user?.id) {
      await checkAction(channel.guild, createExecutor, "webhookCreate", `#${channel.name}`);
      return;
    }
    const deleteExecutor = await getAuditLogUser(channel.guild, AuditLogEvent.WebhookDelete);
    if (deleteExecutor && deleteExecutor !== channel.guild.client.user?.id) {
      await checkAction(channel.guild, deleteExecutor, "webhookDelete", `#${channel.name}`);
    }
  } catch (err) {
    logger.error({ err }, "webhooksUpdate error");
  }
}
